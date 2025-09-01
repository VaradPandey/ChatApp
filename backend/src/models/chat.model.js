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
        required: function(){
            return this.isGrp
        },
        default: "https://res.cloudinary.com/dtobpysyt/image/upload/v1756734487/4fd92857-58b6-4bdd-b9d4-4c33a32185ea.png"
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