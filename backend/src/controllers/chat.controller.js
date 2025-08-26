import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Message } from "../models/message.model.js";

const createPrivateChat=asyncHandler(async (req,res)=>{
    //get both user ids
    const {username}=req.body;
    const userId=req.user._id;

    const otherUser=await User.findOne({username});
    const otherUserId=otherUser._id;
    
    //search for existing chats
    const existingChat=await Chat.findOne({
        isGrp: false,
        participants: {
            $all: [otherUserId,userId]
        }
    });

    if(existingChat){
        const populatedChat=await existingChat.populate("participants","username avatar");
        return res.status(200).json(new ApiResponse(200,populatedChat,"Private DM found"));
    }

    //create new private chat
    const chat=await Chat.create({
        isGrp: false,
        participants: [userId,otherUserId],
        latestMessage: null,
    });

    if(!chat){
        throw new ApiError(400,"Unable to create private chat");
    }

    const populatedChat=await chat.populate("participants","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(201,populatedChat,"New private chat created"));

});

const createGroupChat=asyncHandler(async (req,res)=>{
    //get data from frontend
    let {chatName,usernames}=req.body;

    //valid pariticipants
    if(!Array.isArray(usernames)||usernames.length===0){
        throw new ApiError(400,"Please provide an array of participant usernames");
    }

    //fetch ids from usernames
    const users=await User.find({ username: { $in: usernames } }, "_id username");
    if(users.length!==usernames.length) {
        throw new ApiError(400, "Some usernames are invalid");
    }

    //convert to ids and include creator
    let participants=users.map(user=>user._id.toString());
    participants.push(req.user._id);

    //remove duplicates and sort
    participants=[...new Set(participants.map(id=>id.toString()))].sort();

    //find if group chat already exists
    const existedGrpChat=await Chat.findOne({
        isGrp: true,
        chatName,
        participants,
    })

    if(existedGrpChat){
        const populateGrpChat=await existedGrpChat.populate("participants","username avatar");
        return res.status(200).json(new ApiResponse(201,populateGrpChat,"Existing Group Chat Found"));
    }

    //get group chat image url
    let grpImageUrl;
    if(req.file?.path){
        const uploaded=await uploadOnCloudinary(req.file.path);
        grpImageUrl=uploaded.url||'';
    }

    //create new group chat
    const newGrpChat=await Chat.create({
        isGrp: true,
        chatName,
        participants,
        grpImage: grpImageUrl,
        latestMessage: null,
        createdBy: req.user._id
    });

    const populatedNewGrpChat=await newGrpChat.populate("participants","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(200,populatedNewGrpChat,"New Group Chat Created"));

});

const getChatList=asyncHandler(async (req,res)=>{
    
    const chatList=await Chat.find({participants: req.user._id}).sort({createdAt: -1}).populate([
        {
            path: "latestMessage",   
            select: "messageType content mediaUrl",
            populate:{
                path: "sender",
                select: "username",
            }
        },
        {
            path: "participants",
            select: "username avatar"
        }
    ]);
    
    if(!chatList){
        throw new ApiError(400,"Unable To Fetch Chats");
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200,chatList,"chat list fetched"));
});

const getChat=asyncHandler(async (req,res)=>{
    //get chatid from params
    const {chatId}=req.params;

    //find chat in database
    const chat=await Chat.findById(chatId).populate("participants","username avatar")
    .populate("latestMessage")
    .populate("createdBy","username");

    //if not found then send error
    if(!chat){
        throw new ApiError(404,"Chat Not Found");
    }

    //if found then return chat
    return res
    .status(200)
    .json(new ApiResponse(201,chat,"Chat Found"));

});

const changeGroupImage=asyncHandler(async (req,res)=>{
    //get chatId from params
    const {chatId}=req.params;

    //get chat from database;
    const chat=await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404,"Group Chat Not Found");
    }

    //check is chat is group chat
    if(!chat.isGrp){
        throw new ApiError(400,"Not a Group Chat To Upload Icon");
    }

    //get image url
    let grpImageUrl;
    if(req.file?.path){
        const upload=await uploadOnCloudinary(req.file.path);
        if(!upload){
            throw new ApiError(400,"Unable to upload image");
        }
        grpImageUrl=upload.url||"";
    }

    //edit in db
    chat.grpImage=grpImageUrl;
    await chat.save({validateBeforeSave: false});

    //populate chat
    await chat.populate([
        {
            path: "participants",
            select: "username avatar"
        },{
            path: "createdBy",
            select: "username avatar"
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200,chat,"Group Icon Updated Successfully"));
    
});

const changeGrpName=asyncHandler(async (req,res)=>{
    //get chatid form params
    const {chatId}=req.params;

    //find chat in db
    const chat=await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404,"Chat Not Found");
    }

    //make sure chat is a group chat
    if(!chat.isGrp){
        throw new ApiError(400,"Cant Name A Private Chat")
    }

    //get new name from body
    const {newName}=req.body;
    if(!newName){
        throw new ApiError(404,"New Name Missing");
    }

    //update chatname in model
    chat.chatName=newName.trim();
    await chat.save({validateBeforeSave: false});

    //populate chat
    await chat.populate([{
        path: "participants",
        select: "username avatar"
    },{
        path: "createdBy",
        select: "username avatar"
    }]);

    return res
    .status(200)
    .json(new ApiResponse(200,chat,"Chat Name Updated Successfully"));

});

const addMembers=asyncHandler(async (req,res)=>{
    //get data from fontend
    const {chatId}=req.params;
    const {participantsArr}=req.body;

    //validation check
    if(!Array.isArray(participantsArr)||participantsArr.length===0) {
        throw new ApiError(400, "Please provide an array of participant IDs");
    }

    //get chat from db
    const chat=await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404,"Chat Not Found");
    }

    //check if group or private chat
    if(!chat.isGrp){
        throw new ApiError(400,"Cant Add More Members In a Privte Chat");
    }

    //check if member already exists
    const existingIds=chat.participants.map(id=>id.toString());
    const ifExists=participantsArr.some(id=>existingIds.includes(id.toString()));
    if(ifExists){
        throw new ApiError(400, "One or more members already exist in the group");
    }

    //add members in participants array
    chat.participants.push(...participantsArr);
    await chat.save({validateBeforeSave: false});

    //populate chat
    await chat.populate("participants","username avatar")

    return res
    .status(200)
    .json(new ApiResponse(200,chat,"New Members Added"));

});

const removeMembers=asyncHandler(async (req,res)=>{
    //get data from frontend
    const {chatId}=req.params;
    const {userIds}=req.body; //array of ids

    //validation check
    if(!Array.isArray(userIds) || userIds.length===0){
        throw new ApiError(401,"Please Provide Valid Array Of IDs");
    }

    //get chat form db
    const chat=await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404,"Chat Not Found");
    }

    //prevent removal from private chat
    if(!chat.isGrp){
        throw new ApiError(400,"Cant Remove Members From A Private Chat");
    }

    //find and remove userId in participants array
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        $pullAll: {
            participants: userIds,
        }
    },{new: true});

    //poplulate chat
    await updatedChat.populate("participants","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(200,updatedChat,"User Removed From Group"));

});

const deleteGrpChat=asyncHandler(async (req,res)=>{
    //get chatid from forntend
    const {chatId}=req.params;

    //find chat in db
    const chat=await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404,"Chat Not Found");
    }

    //find all messsage ids with those having chat id and delete
    await Message.deleteMany({chatId: chatId});

    //delete chat from db
    await Chat.findByIdAndDelete(chatId);

    //return
    res
    .status(200)
    .json(new ApiResponse(200,{},"Group Chat Deleted"));

});

const exitGrpChat=asyncHandler(async (req,res)=>{
    //get data from front end
    const {chatId}=req.params;

    //get chat from db
    const chat=await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404,"Group Chat Not Found");
    }

    //make sure it is not private chat
    if(!chat.isGrp){
        throw new ApiError(400,"Cant Exit Proivate Chat");
    }

    //find by id and update using pull
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        $pull: {
            participants: req.user._id,
        }
    },{new:true});

    //delete chat if user was last person
    if(updatedChat.participants.length===0){
        await Chat.findByIdAndDelete(chatId);
        return res.status(200).json(new ApiResponse(200,{},"Chat Deleted"));
    }

    //if user is admin then give role to someone else
    if(updatedChat.createdBy.toString()===req.user._id.toString()){
        const participantArr=updatedChat.participants;
        chat.createdBy=participantArr[Math.floor(Math.random()*participantArr.length)];
        await chat.save({validateBeforeSave: false});
    }

    //populate chat
    await updatedChat.populate("participants","username avatar");

    //return updatedChat
    res
    .status(200)
    .json(new ApiResponse(200,updatedChat,`${req.user.username} left the group chat`));

});

export {
    createPrivateChat,
    createGroupChat,
    getChatList,
    getChat,
    changeGroupImage,
    changeGrpName,
    addMembers,
    removeMembers,
    deleteGrpChat,
    exitGrpChat,
}