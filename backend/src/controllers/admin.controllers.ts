import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse"
import { Request, Response } from "express";
import { Element } from "../db/db";

export const createElement = asyncHandler(async(req:Request,res:Response)=>{
    try {
        // const {imageUrl,width,height,static} = req.body;

        const newElement = await Element.create(req.body)
        if (!newElement) {
            throw new ApiResponse(400,null, "Element can't be created");
        }

        res.status(200).json(new ApiResponse(201,newElement,"Element Created"))

    } catch (error:any) {
        res.status(error.status ?? 500).json({message:"sdsdf"})
        return;
    }
})

export const createMap = asyncHandler(async(req:Request,res:Response)=>{
    try {
        
    } catch (error:any) {
        res.status(error.status ?? 500).json({message:"sdsdf"})
        return;
    }
})