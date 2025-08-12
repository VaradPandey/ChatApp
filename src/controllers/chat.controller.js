import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Message } from "../models/message.model.js";

const createPrivateChat=asyncHandler(async (req,res)=>{
    //get both user ids
    const {otherUserId}=req.body;
    const userId=req.user._id;
    
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
    let {chatName,participants}=req.body;

    //valid pariticipants and group size check
    if(!Array.isArray(participants) || participants.length<=2){
        throw new ApiError(400,"Group Size must be more than 2");
    }

    //push creator in array and sort ids so order doesn't matter
    participants.push(req.user._id);
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

export {
    createPrivateChat,
    createGroupChat,
    getChat,
}