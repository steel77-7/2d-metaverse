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

    await User.findFirst({
      where: {
        id: req.user.id,
      },
      data: {
        avatarId,
      },
    });

    //updating new avatar field
    await Avatar.update({
      where: { id: avatarId },
      data: {
        users: {
          connect: { id: req.user.id },
        },
      },
    });

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

const getAvatars

const getUserAvatarInfo = asyncHandler(async (req: Request, res: Response) => {
  try {
    let userids = req.body;
    userids = userids.split(",");
  
    const avatars = await User.findMany({
      where: {
        id: {
          in: userids,
        },
      },
      select: {
        id: true,
        avatar: {
          select: {
            imageUrl: true,
          },
        },
      },
    });


    if(!avatars){ 
      throw new ApiResponse(400, null, "No avatars found")
    }
    res.status(200).json(new ApiResponse(200,avatars,"Avatars found"))
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

export { setAvatar, getUserAvatarInfo };
