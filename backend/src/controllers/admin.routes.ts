import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { Element } from "../db/db";
const createElement = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { imageUrl, width, height } = req.body;
    
const element = await Element.create({
    data:{
        imageUrl,
        width,
        height,
        static:true
    }
})
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
