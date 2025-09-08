import express from 'express';
import Course from '../models/courses.model.js';
import Material from '../models/materials.model.js';

import { isUserValidator, isAdminValidator } from '../validators/admin.validator.js';

// Using { mergeParams: true } allows us to access :courseId from the parent router
const router = express.Router({ mergeParams: true });

// POST /courses/:courseId/materials
router.post('/', isAdminValidator, async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const material = new Material({
            ...req.body,
            course: courseId
        });
        await material.save();

        course.materials.push(material._id);
        await course.save();

        res.status(201).json(material);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /courses/:courseId/materials/:materialId
router.put('/:materialId', isAdminValidator, async (req, res) => {
    try {
        const { materialId } = req.params;
        const updatedMaterial = await Material.findByIdAndUpdate(materialId, req.body, { new: true });
        if (!updatedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json(updatedMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /courses/:courseId/materials/:materialId
router.delete('/:materialId', isAdminValidator, async (req, res) => {
    try {
        const { courseId, materialId } = req.params;

        await Course.findByIdAndUpdate(courseId, {
            $pull: { materials: materialId }
        });

        const deletedMaterial = await Material.findByIdAndDelete(materialId);
        if (!deletedMaterial) return res.status(404).json({ message: 'Material not found' });

        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;