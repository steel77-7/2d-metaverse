import Router from "express";
import {register,login, refresh } from "../controllers/auth.controllers"
import { authenicator } from "../middlewares/authmiddleWare";
const router = Router();

function ok(){ 
    console.log("hello")
} 
router.route("/signup").post(register);
router.route("/signin").post(login);

//test

router.route("/protected").get(authenicator,ok);
router.route("/refresh-token").get(refresh);
router.route("/avatar").get();

export default router;
 