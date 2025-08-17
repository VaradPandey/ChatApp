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
    messageType:{
        type: String,
        enum: ['text','image','video','file'],
        default: 'text',
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

//add index for faster lookups
messageSchema.index({
    chatId: 1,
    createdAt: -1
});

export const Message=mongoose.model('Message',messageSchema);