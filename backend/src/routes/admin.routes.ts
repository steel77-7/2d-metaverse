import { Router } from "express";
import { createElement } from "../controllers/admin.controllers";
import { createMap } from "../controllers/admin.controllers";
import { adminAuthenticator } from "../middlewares/adminMiddleware";

const router = Router();

router.post(`/element`,adminAuthenticator,createElement);
router.post(`/map`,adminAuthenticator,createMap);

export default router;