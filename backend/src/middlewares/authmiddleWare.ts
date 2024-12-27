import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response, NextFunction } from "express";
import { User } from "../db/db";
import { DecodedToken } from "../types/types";
import { jwtVerify} from 'jose';
export const authenicator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      console.log("token::", token);
      if (!token) {
        throw new ApiResponse(403, null, "Unauthorized Access");
      }

     /*  const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: any, decoded: any) => {
          if (err) {
            throw new ApiResponse(403, err, "Unauthorized Access");
            console.error("Token Verification Error:", err.message);
          } else console.log("Decoded Token:", decoded);
          console.log(decodedToken);
          return decoded as DecodedToken;
        }
      ); */
      const secretKey = Buffer.from(process.env.JWT_SECRET as string, 'utf-8');
      const {payload}= await jwtVerify(token, secretKey) ;
      console.log(payload)
        const user = await User.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
          type: true,
        },
      });
      console.log("user:::", user);
      if (!user) {
        res.status(403).json(new ApiResponse(403, null, "User not found"));
        return;
      }

      req.user = user;
      next();
    }  catch (error: any) {
      console.log(error)
      res
        .status(error.status ?? 500)
        .json(
          new ApiResponse(
            error.status ?? 500,
            error.data,
            error.message ?? "Internal Server Error"
          )
        );
      return;
    }
  }
);
