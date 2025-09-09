import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/courses.model.js';
import Material from '../models/materials.model.js';
import upload from '../modules/upload.module.js';

import { isUserValidator, isAdminValidator } from '../validators/admin.validator.js';

// Using { mergeParams: true } allows us to access :courseId from the parent router
const router = express.Router({ mergeParams: true });

// POST /courses/:courseId/materials - Create a new material
router.post('/', isAdminValidator, async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const { courseId } = req.params;
        const { title, type, source } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        let materialData = { title, type, course: courseId };

        if (type === 'file') {
            if (!req.file) {
                return res.status(400).json({ message: 'File is required for material type "file".' });
            }
            materialData.source = `/uploads/${req.file.filename}`; // URL path to access the file
            materialData.fileName = req.file.originalname;
            materialData.filePath = req.file.path;
            materialData.fileType = req.file.mimetype;
        } else { // 'video'
            materialData.source = source;
        }

        try {
            const material = new Material(materialData);
            await material.save();

            course.materials.push(material._id);
            await course.save();

            res.status(201).json(material);
        } catch (dbErr) {
            res.status(400).json({ message: dbErr.message });
        }
    });
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

        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $pull: { materials: new mongoose.Types.ObjectId(materialId) }
        });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found or material not in course" });
        }

        const deletedMaterial = await Material.findByIdAndDelete(materialId);
        if (!deletedMaterial) {
            return res.status(404).json({ message: 'Material document not found' });
        }

        res.status(204).send(); 
    } catch (err) {
        console.error("Error deleting material:", err); // Log the actual error
        res.status(500).json({ message: "An internal error occurred while deleting the material." });
    }
});

export default router;