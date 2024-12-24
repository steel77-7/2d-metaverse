import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
import { ApiResponse } from "../utils/ApiResponse";
import { CookieOptions } from "express";
//import { access } from "fs";
const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const User = prisma.user;

const generateToken = async (data: any) => {
  return jwt.sign(data, "secret", { expiresIn: "15m" });
};

const register = asyncHandler(async (req: Request, res: Response) => {
  //console.log("hit");
  const { username, email, password } = req.body;
  //basic validation
  //console.log(username,email,password)
  if (!email?.trim() || !username?.trim() || !password?.trim()) {
    res.status(400).json(new ApiResponse(400, "Please send all the data"));
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Passwords Length should be more than 8 characters"
        )
      );
    return;
  }
  //if use is already made then redirect  to login
  const existingUser = await User.findFirst({
    where: {
      OR: [
        { email: "utkarshkaundal1970@gmail.com" },
        { username: "utkarsh" },
      ],
    },
  });
  if (existingUser) {
    res
      .status(400)
      .json(new ApiResponse(400, "User already exists please login"));
    return;
  }

  //hash the password

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  if (!newUser) {
    res.status(400).json(new ApiResponse(500, "User could not be registered"));
    return;
  }
  res.status(200).json(new ApiResponse(200, "User registered"));
  return;
});

const login = asyncHandler(async (req: Request, res: Response) => {
  //console.log("hit")
  const { identifier, password } = req.body;
  //basic validation
  if (!password?.trim()  || !identifier?.trim() ) {
    res
      .status(401)
      .json(new ApiResponse(401, "Please provide valid credentials"));
    return;
  }
  const user = await User.findFirst({
    where: {
      OR: [
        { email: "utkarshkaundal1970@gmail.com" },
        { username: "utkarsh" },
      ],
    },
  });

  //if not of user then return not found
  if (!user) {
    res.status(400).json(new ApiResponse(400, "Account not registered"));
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res
      .status(400)
      .json(new ApiResponse(400, "Wrong credentials or user does not exist"));
    return;
  }

  const accessToken = generateToken({
    email: user.email,
    username: user.username,
  });
  const refreshToken = generateToken({
    email: user.email,
    username: user.username,
  });

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Logged in"));
  return;
});

export { register, login };
