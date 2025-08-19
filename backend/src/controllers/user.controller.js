import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;

    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"User already exists");
    }

    let avatarUrl;
    if(req.file?.path){
        const uploaded=await uploadOnCloudinary(req.file.path);
        avatarUrl=uploaded?.url||"";
    }

    const user=await User.create({
        username,
        email,
        password,
        avatar: avatarUrl,
    });

    const createdUser=await User.findById(user._id).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200,createdUser,"User Registered"));

});

const loginUser=asyncHandler(async (req,res)=>{
    //get username email password
    const {username,email,password}=req.body;

    //check validation
    if(!username && !email){
        throw new ApiError(400,"Give either email or username");
    }
    if(!password){
        throw new ApiError(400,"Password is required");
    }

    //find user in database
    const user=await User.findOne({
        $or: [{username},{email}]
    });

    if(!user){
        throw new ApiError(404,"No user found with that username or email");
    }

    //check for correct password
    const matchPassword=await user.isPasswordCorrect(password);

    if(!matchPassword){
        throw new ApiError(400,"Password Not Matched");
    }

    //create token and cookie
    const token=await user.setUser();

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24*60*60*1000 // 1 day
    });

    //remove password field from user and return it
    const loggedInUser=await User.findById(user._id).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200,loggedInUser,"User Logged In Successfully"));

});

const getUserProfile=asyncHandler(async (req,res)=>{
    console.log(req.user);
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"User Profile Fetched"));
});

const logoutUser=asyncHandler(async (req,res)=>{
     res.clearCookie("accessToken",{
        httpOnly: true,
        secure: false,
     });

     return res.status(200).json({message: "User logged Out"});
});

const changeUserDetails=asyncHandler(async (req,res)=>{
    //get details from body
    const {username,email}=req.body;

    if(!username && !email){
        throw new ApiError(400,"Please provide a username, email, or both");
    }

    //find in db
    const user=await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    //check uniqueness of username
    if(username){
        const existingUserByName=await User.findOne({username});
        if(existingUserByName){
            throw new ApiError(400,"Username already taken");
        }
        user.username=username;
    }

    //check uniqueness of email
    if(email){
        const existingUserByEmail=await User.findOne({email});
        if(existingUserByEmail){
            throw new ApiError(400,"Email already taken");
        }
        user.email=email;
    }

    //confirm changes
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Details Updated Successfully"));

});

const changePassword=asyncHandler(async (req,res)=>{
    //get new password from body
    const {password}=req.body;
    if(!password){
        throw new ApiError(404,"Please Provide Password To Change");
    }

    //find user in database
    const user=await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"Unable To Fetch User");
    }

    //match password with original
    const isSamePassword =await user.isPasswordCorrect(password);
    if(isSamePassword){
        throw new ApiError(400,"Existing Password");
    }

    //update password
    user.password=password;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Password Updated Successfully"));

});

const changeAvatar=asyncHandler(async (req,res)=>{
    //get user from databse
    const user=await User.findById(req.user._id);
    if(!user){
        throw new ApiError(200,"User Not Found");
    }

    //get avatar url
    let avatarUrl='';
    if(req.file?.path){
        const upload=await uploadOnCloudinary(req.file.path);
        if(!upload){
            throw new ApiError(400,"Unable to upload on cloudinary");
        }
        avatarUrl=upload.url;
    }

    //update user
    user.avatar=avatarUrl;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar Updated Successfully"));

});

const deleteUser=asyncHandler(async (req,res)=>{
    //remove it from group chats
    await Chat.updateMany(
        {
            participants: req.user._id
        },{
            $pull: {
                participants: req.user._id,
            }
        }
    );

    //set group admin to someone else or delete it
    const chats=await Chat.find({createdBy: req.user._id});
    for(const chat of chats){
        if(chat.participants.length>0){
            const participantArr=chat.participants;
            chat.createdBy=participantArr[Math.floor(Math.random()*participantArr.length)]
            await chat.save({validateBeforeSave: false});
        }else{
            await chat.deleteOne();
        }
    }  

    //set null wherever user texted but keep the content
    await Message.updateMany(
        {
            sender: req.user._id
        },{
            $set :{
                sender: null,
            }
        }
    );

    //delete the user
    await User.findByIdAndDelete(req.user._id);

    //return
    return res
    .status(200)
    .json(new ApiResponse(200,{},"User Deleted"));
});

const authMe=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select("-password")
    if(!user){
        throw new ApiError(404,"User Not Found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"User Fetched"));
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    changeUserDetails,
    changePassword,
    changeAvatar,
    deleteUser,
    authMe
}