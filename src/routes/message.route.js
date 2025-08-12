import { Router } from "express";
import { createMessage } from "../controllers/message.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route('/createMessage').post(authenticate,upload.single("mediaUrl"),createMessage);

export default router;