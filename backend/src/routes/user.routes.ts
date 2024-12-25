import {Router} from "express"
import { getAvatarInfo, setAvatar } from "../controllers/user.controllers";
import { authenicator } from "../middlewares/authmiddleWare";

const router = Router(); 

router.route('/metadata').post(authenicator,setAvatar);
router.route("/metaData/bulk/?id").get(authenicator,getAvatarInfo);

