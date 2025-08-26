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
        default: "https://us1.discourse-cdn.com/asana/optimized/3X/0/e/0e66ce17b14559e585bf19f090f67cca412a6b54_2_690x427.png"
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