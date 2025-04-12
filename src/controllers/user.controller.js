import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from backend
  //validation - not empty
  //check if user already exists
  //check for images, check for avatar
  //upload them to cloundinary, avatar
  //create user object - create entry in db
  //remove password and refresh token from response
  //check for user creation
  //return response

//   // === DEBUG START ===
//   console.log("DEBUG 1 - Request Files:", {
//     filesReceived: !!req.files,
//     avatarExists: !!req.files?.avatar,
//     coverImageExists: !!req.files?.coverImage,
//   });

//   if (req.files?.avatar) {
//     console.log("DEBUG 2 - Avatar File Details:", {
//       originalname: req.files.avatar[0].originalname,
//       path: req.files.avatar[0].path,
//       size: req.files.avatar[0].size,
//       mimetype: req.files.avatar[0].mimetype,
//     });
//   }
//   // === DEBUG END ===
//   // === DEBUG 3 - File System Check ===

//   const tempAvatarPath = path.resolve(req.files.avatar[0].path);
//   console.log("DEBUG 3 - File System Verification:", {
//     absolutePath: tempAvatarPath,
//     fileExists: fs.existsSync(tempAvatarPath),
//     fileStats: fs.existsSync(tempAvatarPath) ? fs.statSync(tempAvatarPath) : "FILE MISSING",
//   });
//   // === END DEBUG ===
//   // === DEBUG 4 - Cloudinary Config Check ===
// console.log("DEBUG 4 - Cloudinary Environment Variables:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "****" : "MISSING",
//     api_key: process.env.CLOUDINARY_API_KEY ? "****" : "MISSING", 
//     api_secret: process.env.CLOUDINARY_API_SECRET ? "****" : "MISSING"
// });

// // Test direct upload without your wrapper
// try {
//     const testUpload = await cloudinary.v2.uploader.upload(tempAvatarPath, {
//         resource_type: "auto",
//         folder: "debug-tests"
//     });
//     console.log("DEBUG 5 - Direct Upload Success:", testUpload.secure_url);
// } catch (directError) {
//     console.error("DEBUG 5 - Direct Upload Failed:", {
//         message: directError.message,
//         http_code: directError.http_code,
//         stack: directError.stack
//     });
// }
// // === END DEBUG ===
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((field) => !field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  if (!fs.existsSync(avatarLocalPath)) {
    throw new ApiError(400, "Avatar file not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});
export { registerUser };
