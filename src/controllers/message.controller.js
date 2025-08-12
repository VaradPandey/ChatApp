import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Message } from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Chat } from "../models/chat.model.js";

const createMessage=asyncHandler(async (req,res)=>{
    //get data from  frontend
    const {chatId,messageType}=req.body;
    
    //check for message type
    let entry=null;
    if(messageType==='text'){
       entry=req.body.content;
    }else{
        //medialUrl cloudinary upload
        if(req.file?.path){
            const upload=await uploadOnCloudinary(req.file.path);
            if(!upload){
                throw new ApiError(401,"Unable To Upload Media")
            }
            entry=upload.url;
        }
    }

    //create message and store on db
    const message=await Message.create({
        chatId,
        sender: req.user._id,
        messageType,
        content: messageType==='text'?entry:null,
        mediaUrl: messageType!=='text'?entry:"",
    });

    if(!message){
        throw new ApiError(404,"Message not able to create");
    }

    //set latest message in ChatModel
    const chat=await Chat.findById(chatId);
    if(chat){
        chat.latestMessage=message;
        await chat.save({validateBeforeSave: false});
    }

    // Populate useful fields before sending back
    await message.populate([
        {path: "sender",select: "username avatar"},
        {path: "chatId",populate: {
            path: "participants",
            select: "username avatar"
        }}
    ]);
    //return message
    return res
    .status(200)
    .json(new ApiResponse(200,message,"Message Created"));
});

export {
    createMessage,
}