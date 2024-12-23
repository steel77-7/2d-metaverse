import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
//import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";

const generateAccessandRefreshToken = async (userId: string) => {
  /*  try {
      const user = await User.findById(userId);
      if (user == null) {
        throw new ApiResponse(
          401,
          "Something went wrong while generating access and refresh token"
        );
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiResponse(
        401,
        "Something went wrong while generating access and refresh token"
      );
    } */
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !email ||
    !username ||
    !password ||
    email == "" ||
    password == "" ||
    username == ""
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please send all the data"));
  }
});

const login = asyncHandler(async (req: Request, res: Response) => {});

export { register, login };
