import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse"
import { Request, response, Response } from "express";
import { Element } from "../db/db";

export const createElement = asyncHandler(async(req:Request,res:Response)=>{
    try {
        // const {imageUrl,width,height,static} = req.body;
        if(req.user.type!=="admin"){
            throw new ApiResponse(401,null,"Unauthorized")
        }
        const newElement = await Element.create(req.body)
        console.log(newElement)
        if (!newElement) {
            throw new ApiResponse(400,null, "Element can't be created");
        }

        res.status(200).json(new ApiResponse(201,newElement,"Element Created"))

    } catch (error:any) {
        res.status(error.status ?? 500).json({message:"sdsdf"})
        return;
    }
})
export const updateImageOfElement = asyncHandler(async(req:Request,res:Response)=>{
    try {
        // const {imageUrl,width,height,static} = req.body;
        if(req.user.type!=="admin"){
            throw new ApiResponse(401,null,"Unauthorized")
        }
        const {imageUrl} = req.body;

        if(!imageUrl){
            throw new ApiResponse(400,null,"Please Provide image url");
        }

        const updatedElement = await Element.update({
            where:{
                id:req.params.elementId
            },
            data:{
                imageUrl
            }
        })

        if(!updatedElement){
            throw new ApiResponse(400,updatedElement,"Can't update")
        }

        res.status(200).json(new ApiResponse(200,updatedElement,"Updated"))

    } catch (error:any) {
        res.status(error.status ?? 500).json({message:"sdsdf"})
        return;
    }
})

// export const createMap = asyncHandler(async(req:Request,res:Response)=>{
//     try {

//     } catch (error:any) {
//         res.status(error.status ?? 500).json({message:"sdsdf"})
//         return;
//     }
// })