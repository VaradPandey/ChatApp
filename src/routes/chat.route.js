import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createPrivateChat,
    createGroupChat,
    getChat,
    changeGroupImage,
    changeGrpName,
} from "../controllers/chat.controller.js";

const router=Router();

router.route('/createPrivateChat').post(authenticate,createPrivateChat);
router.route('/createGroupChat').post(authenticate,upload.single("grpImage"),createGroupChat);
router.route('/:chatId').get(authenticate,getChat);
router.route('/:chatId/editGrpIcon').post(authenticate,upload.single("grpImage"),changeGroupImage);
router.route('/:chatId/editGrpName').post(authenticate,changeGrpName);


export default router;