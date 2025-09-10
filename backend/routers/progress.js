import express from 'express';
import Progress from '../models/progress.model.js';
import { isUserValidator } from '../validators/admin.validator.js';

const router = express.Router();

// POST /progress/complete
router.post('/complete', isUserValidator, async (req, res) => {
    if (req.user.isAdmin) {
        return res.status(200).json({ message: 'Admin progress is not tracked.' });
    }
    
    const { courseId, materialId } = req.body;
    const userId = req.user._id;

    try {
        let progress = await Progress.findOne({ user: userId, course: courseId });

        if (!progress) {
            // If no progress doc exists, create one
            progress = new Progress({
                user: userId,
                course: courseId,
                completedMaterials: [materialId]
            });
        } else {
            // Add material to the set to prevent duplicates
            await Progress.updateOne(
                { _id: progress._id },
                { $addToSet: { completedMaterials: materialId } }
            );
        }
        
        await progress.save();
        res.status(200).json({ message: 'Progress updated successfully.' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;