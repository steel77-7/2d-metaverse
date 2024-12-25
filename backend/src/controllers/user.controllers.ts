import { User } from "../db/db";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { Avatar } from "../db/db";
const setAvatar = asyncHandler(async (req: Request, res: Response) => {
  try {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    ////console.log("hit");
    const { username, email, password,type="user" } = req.body;
    //basic validation
    //console.log(username,email,password)
    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      throw new ApiResponse(400, null,"Please enter all the fields");
=======
=======
>>>>>>> Stashed changes
    const { avatarId } = req.body;
    const avatar = await Avatar.findUnique({ where: { id: avatarId } });
    if (!avatar) {
      throw new ApiResponse(400, null, "Avatar not Updated");
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    }
    //if use is already made then redirect  to login
    const existingUser = await User.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      throw new ApiResponse(400,null, "User already exists please login");
    }

    //hash the password

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      data: {
        username,
        email,
        password: hashedPassword,
        type
      },
    });

    if (!newUser) {
      throw new ApiResponse(400,null, "User can't be created");
    }
    res.status(201).json(new ApiResponse(201,{id:newUser.id}, "User registered"));
    return;
  } catch (error: any) {
    res.status(error.status ?? 500).json(new ApiResponse(error.status ?? 500 ,null, error.message??"Internal Server Error"));
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    return;
  }
});



const getAvatarInfo=asyncHandler(async(req:Request,res:Response)=>{


    try {
        let userids = req.body;
        userids = userids.slice(",")
const avatars = await Avatar.find

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
})

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    //console.log(accessToken, "\n........\n", refreshToken);
    /*   const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  }; */

    /*   res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,null, "Logged in"));
  return; */
    res.status(200).json(
      new ApiResponse(200, {
        id:user.id,
        token:accessToken,
        refreshToken,
      },"Logged In")
    );
    return;
  } catch (error: any) {
    res.status(error.status ?? 500).json(new ApiResponse(error.status ?? 500,null, error.message??"Internal Server Error"));
    return;
  }
});

const refresh = asyncHandler(async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.body.refreshToken || req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      res.status(404).json(new ApiResponse(404, null,"Refresh Token Not Found"));
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
      throw new ApiResponse(400,null, "User not found");
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiResponse(404,null, "Refresh token failed to generate ");
    }

    const accessToken = await generateToken(
      { id: user?.id, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_EXPIRY as string,
      process.env.JWT_SECRET as string
    );
    const refreshToken = await generateToken(
      { id: user?.id, email: user.email },
      process.env.REFRESH_TOKEN_EXPIRY as string,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    /*  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Access token refreshed"));
  return; */
    res.status(200).json(
      new ApiResponse(200, {
        accessToken,
        refreshToken,
      },"Access token refreshed")
    );
    return;
  } catch (error: any) {
    res.status(error.status ?? 500).json(new ApiResponse(error.status ?? 500, null,error.message??"Internal Server Error"));
    return;
  }
});

export { register, login, refresh };
=======
export { 
    setAvatar,
    getAvatarInfo
}
>>>>>>> Stashed changes
=======
export { 
    setAvatar,
    getAvatarInfo
}
>>>>>>> Stashed changes
