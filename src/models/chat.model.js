import mongoose, { Schema } from "mongoose";

const chatSchema=new mongoose.Schema({
    isGrp:{
        type: Boolean,
        required: true,
        default: false,
    },
    chatName:{
        type: String,
        required: function(){
            return this.isGrp
        }
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    grpImage:{
        type: String, //cloudinary url
    },
    latestMessage:{
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: function(){
            return this.isGrp
        }
    }

},{timestamps: true});

export const Chat=mongoose.model('Chat',chatSchema);