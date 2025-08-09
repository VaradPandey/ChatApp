import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type:String //cloudinary url
    },
    status:{
        type: String,
        enum: ['online','offline','busy'],
    },
    lastSeen:{
        type: Date,
        default: Date.now,
    },
},{timestamps: true});

export const User=mongoose.model('User',userSchema);