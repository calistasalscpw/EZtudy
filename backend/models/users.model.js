import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true 
        },
        email: { 
            type: String, 
            required: true,
            unique: true,
            match: [/.*@.*\..*/, "Please fill a valid email format"]
        },
        password: { 
            type: String
        },
        isAdmin: { 
            type: Boolean, 
            default: false 
        },
        registerType: { 
            type: String, enum: ['normal', 'google'], 
            default: 'normal' 
        },
        socialId: String,
        // courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
        isVerified: {
            type: Boolean,
            default: false
        }
    }, { 
        timestamps: true 
    }
);

// Hash password before saving
UserSchema.pre("save", async function () {
    if (this.password && this.isNew || this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
})

const User = mongoose.model('User', UserSchema);
export default User;