import {Router} from "express"
import { getUserAvatarInfo,setAvatar } from "../controllers/user.controllers";
import { authenicator } from "../middlewares/authmiddleWare";

const router = Router(); 

router.route('/metadata').post(authenicator,setAvatar);
router.route("/metaData/bulk/?id").get(authenicator,getUserAvatarInfo);
router.route("/metaData/bulk/?id").get(authenicator,getAvatarInfo);


export default router;