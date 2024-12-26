import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/db";
import { DecodedToken } from "../types/types";
import { ApiResponse } from "../utils/ApiResponse";
const hash = Number(process.env.HASH);
const generateToken = (data: any, time: string, secret: string) => {
  return jwt.sign(data, secret, { expiresIn: time });
};

const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    ////console.log("hit");
    const { username, email, password } = req.body;
    //basic validation
    //console.log(username,email,password)
    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      throw new ApiResponse(400, null, "Please enter all the fields");
    }

    if (password.length < 8) {
      throw new ApiResponse(
        400,
        null,
        "Passwords Length should be more than 8 characters"
      );
    }
    //if use is already made then redirect  to login
    const existingUser = await User.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      throw new ApiResponse(400, null, "User already exists please login");
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, hash );
    const newUser = await User.create({
      data: {
      ...req.body
      },
    });

    if (!newUser) {
      throw new ApiResponse(400, null, "User already exists please login");
    }


    const accessToken = generateToken(
      {
        id: newUser.id,
        type:newUser.type
      },
      process.env.ACCESS_TOKEN_EXPIRY as string,
      process.env.JWT_SECRET as string
    );

    const refreshToken = generateToken(
      {
        id: newUser.id,
      },
      process.env.REFRESH_TOKEN_EXPIRY as string,
      process.env.REFRESH_TOKEN_SECRET as string
    ); 
    res.status(201).json(new ApiResponse(201, {
      token: accessToken,
      refreshToken
    },"User registered"));
    
   


    //res.status(201).json(new ApiResponse(201, null, "User registered"));
    return;
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json(
        new ApiResponse(
          error.status ?? 500,
          null,
          error.message ?? "Internal Server Error"
        )
      );
    return;
  }
});

const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    ////console.log("hit")
    const { identifier, password } = req.body;
    //basic validation
    if (!password?.trim() || !identifier?.trim()) {
      throw new ApiResponse(400, null, "Enter all the credentials");
    }

    const user = await User.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    //if not of user then return not found
    if (!user) {
      throw new ApiResponse(400, null, "User not found please signup");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiResponse(400, null, "credentials are wrong");
    }

    const accessToken = generateToken(
      {
        id: user.id,
        type:user.type
      },
      process.env.ACCESS_TOKEN_EXPIRY as string,
      process.env.JWT_SECRET as string
    );

    const refreshToken = generateToken(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_EXPIRY as string,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    if (!accessToken || !refreshToken) {
      throw new ApiResponse(400, null, "token not found");
    }

    await User.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken as String,
      },
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token: accessToken,
          refreshToken,
        },
        "Logged In"
      )
    );
    return;
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json(
        new ApiResponse(
          error.status ?? 500,
          null,
          error.message ?? "Internal Server Error"
        )
      );
    return;
  }
});

const refresh = asyncHandler(async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.body.refreshToken || req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      res
        .status(404)
        .json(new ApiResponse(404, null, "Refresh Token Not Found"));
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
      throw new ApiResponse(400, null, "User not found");
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiResponse(404, null, "Refresh token failed to generate ");
    }

    const accessToken = generateToken(
      { id: user?.id, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_EXPIRY as string,
      process.env.JWT_SECRET as string
    );
    const refreshToken = generateToken(
      { id: user?.id, email: user.email },
      process.env.REFRESH_TOKEN_EXPIRY as string,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access token refreshed"
      )
    );
    return;
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json(
        new ApiResponse(
          error.status ?? 500,
          null,
          error.message ?? "Internal Server Error"
        )
      );
    return;
  }
});

export { register, login, refresh };
