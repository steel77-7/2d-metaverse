import { Router } from "express";
import { createElement, updateImageOfElement } from "../controllers/admin.controllers";
import { authenicator } from "../middlewares/authmiddleWare";
// import { createMap } from "../controllers/admin.controllers";
// import { adminAuthenticator } from "../middlewares/adminMiddleware";

const router = Router();

router.route(`/element`).post(authenicator,createElement);
router.route(`/element/:elementId`).put(authenicator,updateImageOfElement);
// router.post(`/map`,adminAuthenticator,createMap);


export default router;