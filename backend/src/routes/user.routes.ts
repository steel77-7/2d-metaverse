import Router from "express";
import {register,login, refresh } from "../controllers/user.controllers"
import { authenicator } from "../middlewares/authmiddleWare";
const router = Router();

function ok(){ 
    console.log("hello")
} 
router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/protected").get(authenicator,ok);
router.route("/refresh-token").get(refresh);



export default router;
 