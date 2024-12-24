import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/db";
import { DecodedToken } from "../types/types";
//const { PrismaClient } = require("@prisma/client");
import { ApiResponse } from "../utils/ApiResponse";
import { CookieOptions } from "express";
//import { access } from "fs";
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (data: any, time: string, secret: string) => {
  if (JWT_SECRET) return jwt.sign(data, secret, { expiresIn: time });
  return null;
};

const register = asyncHandler(async (req: Request, res: Response) => {
  ////console.log("hit");
  const { username, email, password } = req.body;
  //basic validation
  ////console.log(username,email,password)
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
      OR: [{ email }, { username }],
    },
  });
  if (existingUser) {
    res
      .status(201)
      .json(new ApiResponse(201, "User already exists please login"));
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
  ////console.log("hit")
  const { identifier, password } = req.body;
  //basic validation
  if (!password?.trim() || !identifier?.trim()) {
    res
      .status(401)
      .json(new ApiResponse(401, "Please provide valid credentials"));
    return;
  }

  const user = await User.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
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

  const accessToken = await generateToken(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.ACCESS_TOKEN_EXPIRY as string,
    process.env.JWT_SECRET as string
  );

  const refreshToken = await generateToken(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_EXPIRY as string,
    process.env.REFRESH_TOKEN_SECRET as string
  );
  if (!accessToken || !refreshToken) {
    res.status(500).json(new ApiResponse(500, "Server Error occured"));
    return;
  }

  await User.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken.toString(),
    },
  });

  //console.log(accessToken, "\n........\n", refreshToken);
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

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.body.refreshToken || req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    res.status(404).json(new ApiResponse(404, "Refresh Token Not Found"));
    return;
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as DecodedToken;
  //console.log("decoded token", decodedToken);
  const user = await User.findUnique({
    where: {
      id: decodedToken?.id,
    },
  });

  if (!user) {
    res.status(401).json(new ApiResponse(401, "Token Expired"));
    return;
  }

  if (incomingRefreshToken != user?.refreshToken) {
    res.status(404).json(new ApiResponse(404, "Invalid Refresh Token"));
    return;
  }

  const accessToken = await generateToken(
    { id: user?.id, email: user.email, username: user.username },
    process.env.ACCESS_TOKEN_EXPIRY as string,
    process.env.JWT_SECRET as string
  );
  const refreshToken = await generateToken(
    { id: user?.id, email: user.email },
    process.env.REFRESH_TOKEN_EXPIRY as string,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Access token refreshed"));
  return;
});

export { register, login, refresh };
