import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        type: { 
            type: String, 
            enum: ['file', 'video', 'quiz'], 
            required: true 
        },
        source: { 
            type: String, 
            required: true 
        }, // URL for video, file path, or quiz ID
        course: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Course' 
        }
    }, { 
    timestamps: true 
    }
);

const Material = mongoose.model('Material', MaterialSchema);
export default Material;