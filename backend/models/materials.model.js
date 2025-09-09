import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        type: { 
            type: String, 
            enum: ['file', 'video'], 
            required: true 
        },
        source: { 
            type: String, 
            required: true 
        }, 
        fileName: String,
        filePath: String,
        fileType: String,
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