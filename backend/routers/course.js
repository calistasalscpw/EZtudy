import express from 'express';
import Course from '../models/courses.model.js';
import Material from '../models/materials.model.js';
import materialRouter from './material.js'; 

import { isUserValidator, isAdminValidator } from '../validators/admin.validator.js';

const router = express.Router();

router.use('/:courseId/materials', materialRouter);

// GET all courses with search and pagination
router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const query = keyword ? {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        } : {};

        const total = await Course.countDocuments(query);
        const courses = await Course.find(query).skip(skip).limit(pageSize);

        res.json({ data: courses, total, page, pageSize });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single course with its materials populated
router.get('/:courseId', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('materials');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new course (Admin only)
router.post('/', isAdminValidator, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) a course (Admin only)
router.put('/:courseId', isAdminValidator, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a course (Admin only)
router.delete('/:courseId', isAdminValidator, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Delete all materials associated with the course
        await Material.deleteMany({ _id: { $in: course.materials } });

        // Delete the course itself
        await Course.findByIdAndDelete(req.params.courseId);

        res.json({ message: 'Course and associated materials deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;