import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response, NextFunction } from "express";
import { User } from "../db/db";
import { DecodedToken } from "../types/types";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenicator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
        console.log("token::",token)
      if (!token) {
        res.status(403).json(new ApiResponse(403,null, "Unauthorized Access"));
        return;
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      console.log(decodedToken)
      
      const user = await User.findUnique({
        where: {
          id: decodedToken.id,
        },
        select: {
          id: true,
          type:true
        },
      });
      console.log('user:::',user)
      console.log('user:::',user)
      if (!user) {
        res.status(403).json(new ApiResponse(403,null, "User not found"));
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(403).json(new ApiResponse(403,null, "Invalid access token"));
      return;
    }
  }
);