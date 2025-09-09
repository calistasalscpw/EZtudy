import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        course: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Course',
            required: true 
        },
        completedMaterials: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Material' 
    }],
}, { timestamps: true });

ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const Progress = mongoose.model('Progress', ProgressSchema);
export default Progress;