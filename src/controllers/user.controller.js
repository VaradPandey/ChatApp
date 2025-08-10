import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../../../videoproject/src/utils/cloudinary.js";

const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;

    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"User already exists");
    }

    const avatarLocalPath=req.file?.path;
    const avatar=await uploadOnCloudinary(avatarLocalPath);

    const user=await User.create({
        username,
        email,
        password,
        avatar: avatar.url||"",
    });

    const createdUser=await User.findById(user._id).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200,createdUser,"User Registered"));

});

export {
    registerUser,
}