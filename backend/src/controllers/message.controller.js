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

const getMessage=asyncHandler(async (req,res)=>{
    //get id from frontend
    const {messageId}=req.params;
    
    //search in db
    const message=await Message.findById(messageId);

    if(!message){
        throw new ApiError(404,"Message not found");
    }

    //populte message
    await message.populate([
        {
            path:"sender",select:"username avatar"
        },
        {
            path: "chatId",
            populate: {
                path: "participants",
                select: "username avatar",
            }
        }
    ]);

    //return response
    return res
    .status(200)
    .json(new ApiResponse(201,message,"Message Found In Database"));

});

const editMessage=asyncHandler(async (req,res)=>{
    //get message id form front end
    const {messageId}=req.params;

    //find message in db
    const message=await Message.findById(messageId);

    if(!message){
        throw new ApiError(404,"Message Not Found");
    }

    //make sure message is sent by the logged in user
    if(message.sender.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Cant Edit Someone Else Message");
    }

    //get new text
    const {newText}=req.body;

    if(!newText){
        throw new ApiError(400,"Provide New Message To Edit");
    }

    //edit the message
    message.content=newText;
    await message.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,message,"Message Updated"));

});

const deleteMessage=asyncHandler(async (req,res)=>{
    //get id from params
    const {messageId}=req.params;
    
    //check is message exists
    const message=await Message.findById(messageId);

    if(!message){
        throw new ApiError(404,"Message Not Found");
    }

    //get chat of the message
    const chat=await Chat.findById(message.chatId);
    if(!chat){
        throw new ApiError(404,"Chat Not Found");
    }

    //check if user sent the message or if it is admin of the group
    if((message.sender.toString()!==req.user._id.toString()) && (chat.createdBy.toString()!==req.user._id.toString())){
        throw new ApiError(403,"Permission Not Granted");
    }
    
    //if latest message in chat then update chat model
    if(chat.latestMessage?.toString()===messageId.toString()){
        const msgs=await Message.find({chatId: message.chatId}).sort({createdAt: -1}).limit(2);
        if(msgs.length>1){
            chat.latestMessage=msgs[1]._id;
        }else{
            chat.latestMessage=null;   
        }
        
        await chat.save({validateBeforeSave: false});
    }

    //delete it
    await Message.deleteOne({_id: messageId});

    return res
    .status(200)
    .json(new ApiResponse(200,null,"Message Successfully Deleted"));
});

export {
    createMessage,
    getMessage,
    editMessage,
    deleteMessage,
}