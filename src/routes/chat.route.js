import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createPrivateChat,
    createGroupChat,
} from "../controllers/chat.controller.js";

const router=Router();


router.route('/createPrivateChat').post(authenticate,createPrivateChat);
router.route('/createGroupChat').post(authenticate,upload.single("grpImage"),createGroupChat);


export default router;