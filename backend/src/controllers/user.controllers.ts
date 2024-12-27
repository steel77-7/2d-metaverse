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


const getAvatars = asyncHandler(async (req: Request, res: Response) => {
  try {
    const avatars = await Avatar.findMany({
      select: {
        id: true,
        imageUrl: true,
        name: true,
      },
    });
    if (!avatars || avatars.length == 0) {
      throw new ApiResponse(400, null, "No avatars found");
    }

    res.status(200).json(new ApiResponse(200, null, "Avatars found "));
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

const getUserAvatarInfo = asyncHandler(async (req: Request, res: Response) => {
  try {
    const useridStr = req.query.id as string;
    let userids = useridStr
      .slice(1, -1)
      .split(",")
      .map((e) => Number(e));

    console.log(userids);
    const avatars = await User.findMany({
      where: {
        id: {
          in: userids,
        },
        avatar: {
          isNot: null,
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

    if (!avatars || avatars.length == 0) {
      throw new ApiResponse(400, null, "No user avatars found");
    }
    res.status(200).json(new ApiResponse(200, avatars, "User avatars found"));
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

export { setAvatar, getUserAvatarInfo, getAvatars };
