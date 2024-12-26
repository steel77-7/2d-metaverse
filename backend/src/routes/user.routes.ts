import {Router} from "express"
import { getUserAvatarInfo,setAvatar,getAvatars } from "../controllers/user.controllers";
import { authenicator } from "../middlewares/authmiddleWare";

const router = Router(); 

router.route('/metadata').post(authenicator,setAvatar);
router.route("/metaData/bulk").get(authenicator,getUserAvatarInfo);
router.route("/avatars").get(authenicator,getAvatars);


export default router;