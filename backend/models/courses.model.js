import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String 
        },
        materials: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Material' 
        }]
    }, { 
        timestamps: true 
    }
);

const Course = mongoose.model('Course', CourseSchema);
export default Course;