
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../db/db";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { Avatar } from "../db/db";
const setAvatar = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { avatarId } = req.body;
    const avatar = await Avatar.findUnique({ where: { id: avatarId } });
    if (!avatar) {
      throw new ApiResponse(400, null, "Avatar not Updated");
    }



    

//updating new avatar field
    await Avatar.update({
        where:{id:avatarId},
        data:{ 
            users:{
                connect:{id:req.user.id}
            }
        }
    })
    //avatar to be sent??
    res.status(200).json(new ApiResponse(200, { avatar }, "Avatar Updated"));
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

const getAvatarInfo = asyncHandler(async (req: Request, res: Response) => {
  try {
    let userids = req.body;
    userids = userids.slice(",");
    const avatars = await Avatar.findMany({
        where:{ 
           user:{
            in:userids
           }
        }
    });
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









export { setAvatar, getAvatarInfo }
