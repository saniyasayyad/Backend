import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get user data from request
  console.log("\n REGISTRATION REQUEST RECEIVED");
  const { fullName, email, username, password } = req.body;

  console.log("Request body:", { fullName, email, username });
  console.log("Files received:", req.files);

  // Validate required fields
  console.log("\n VALIDATING USER INPUT...");
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  console.log(" All required fields present");

  // Check if user already exists
  console.log("\n CHECKING IF USER ALREADY EXISTS...");

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  console.log("User does not exist - can proceed with registration");

  // Upload files to Cloudinary
  console.log("\n  UPLOADING FILES TO CLOUDINARY...");

  let avatarLocalPath;
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
    console.log("Avatar file path:", avatarLocalPath);
  }

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
    console.log("Cover image file path:", coverImageLocalPath);
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  console.log("Uploading avatar...");
  const avatar = await uploadCloudinary(avatarLocalPath);
  console.log("Avatar uploaded:", avatar?.url);

  let coverImage = null;
  if (coverImageLocalPath) {
    console.log("Uploading cover image...");
    coverImage = await uploadCloudinary(coverImageLocalPath);
    console.log("Cover image uploaded:", coverImage?.url);
  }

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // Create user in database
  console.log("\nCREATING USER IN DATABASE...");
  console.log("User data being saved:", {
    fullName,
    email,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password: password.substring(0, 3) + "...", // Show first 3 chars
  });

  let user;
  try {
    user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });
    console.log(" USER CREATED IN DATABASE");
    console.log("- User ID:", user._id);
  } catch (error) {
    console.log(" DATABASE ERROR DETAILS:");
    console.log("- Error name:", error.name);
    console.log("- Error message:", error.message);
    console.log("- Error stack:", error.stack);
    throw error;
  }

  // Get created user (excluding password and refresh token)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
