import mongoose, { Schema, Types } from "mongoose";

const messageSchema=new mongoose.Schema({
    chatId:{
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content:{
        type: String,
        required: function(){
            return this.messageType==='text'
        }
    },
    mediaUrl:{
        type: String, //cloudinary url
        required: function(){
            return ['image','video','file'].includes(this.messageType)
        }
    },
    messageType:{
        type: String,
        enum: ['text','image','video','file'],
    },
    status:{
        type: String,
        enum: ['sent','read'],
        default: 'sent'
    },
    readBy:[
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ]
},{timestamps: true});

export const Message=mongoose.model('Message',messageSchema);