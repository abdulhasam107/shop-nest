import mongoose  from "mongoose";   

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true ,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }



}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;