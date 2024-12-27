import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { SignJWT } from 'jose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/db";
import { DecodedToken } from "../types/types";
import { ApiResponse } from "../utils/ApiResponse";
const hash = Number(process.env.HASH);
/* const generateToken = (data: any, time: string, secret: string) => {
  return jwt.sign(data, secret, { expiresIn: time });
}; */

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
    const hashedPassword = await bcrypt.hash(password, hash);
    const newUser = await User.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
        type: req.body.type,
        email: req.body.email,
      },
    });

    if (!newUser) {
      throw new ApiResponse(400, null, "User already exists please login");
    }

    /*   const accessToken = generateToken(
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
   */

    res
      .status(201)
      .json(new ApiResponse(201, { id: newUser.id }, "User registered"));
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



/* const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    // Basic validation
    if (!password?.trim() || !identifier?.trim()) {
      throw new ApiResponse(400, null, "Enter all the credentials");
    }

    // Find user based on identifier (email or username)
    const user = await User.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    // If user not found, return an error
    if (!user) {
      throw new ApiResponse(400, null, "User not found, please signup");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiResponse(400, null, "Credentials are wrong");
    }

    // Get secrets from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    // Ensure secrets are available in the environment variables
    if (!jwtSecret || !refreshTokenSecret) {
      throw new ApiResponse(500, null, "JWT secret or refresh token secret is missing");
    }

    // Create tokens using jose
    const now = Math.floor(Date.now() / 1000);
    const expirationAccess = now + 60 * 30; // Access token expires in 30 minutes
    const expirationRefresh = now + 60 * 60; // Refresh token expires in 1 hour

    // Sign access token
    const accessToken = await new SignJWT({
      sub: user.id,
      type: user.type,
      iat: now,
      exp: expirationAccess,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(jwtSecret));

    // Sign refresh token
    const refreshToken = await new SignJWT({
      sub: user.id,
      iat: now,
      exp: expirationRefresh,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(refreshTokenSecret));

    if (!accessToken || !refreshToken) {
      throw new ApiResponse(400, null, "Tokens not generated");
    }

    // Store refresh token in the database
    await User.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    // Respond with the tokens
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
}); */
const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!password?.trim() || !identifier?.trim()) {
      throw new ApiResponse(400, null, "Enter all the credentials");
    }

    const user = await User.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new ApiResponse(400, null, "User not found, please signup");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiResponse(400, null, "Credentials are wrong");
    }

    const jwtSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!jwtSecret || !refreshTokenSecret) {
      throw new ApiResponse(500, null, "JWT secret or refresh token secret is missing");
    }

    const now = Math.floor(Date.now() / 1000);
    const expirationAccess = now + 60 * 30;
    const expirationRefresh = now + 60 * 60;

    const accessToken = await new SignJWT({
      id: user.id,
      type: user.type,
      iat: now,
      exp: expirationAccess,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(Buffer.from(jwtSecret));

    const refreshToken = await new SignJWT({
      sub: user.id,
      iat: now,
      exp: expirationRefresh,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(Buffer.from(refreshTokenSecret));

    if (!accessToken || !refreshToken) {
      throw new ApiResponse(400, null, "Tokens not generated");
    }

    await User.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
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

    /*   const accessToken = generateToken(
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
    ); */
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
