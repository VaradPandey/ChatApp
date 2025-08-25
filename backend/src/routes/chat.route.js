import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createPrivateChat,
    createGroupChat,
    getChatList,
    getChat,
    changeGroupImage,
    changeGrpName,
    addMembers,
    removeMembers,
    deleteGrpChat,
    exitGrpChat,
} from "../controllers/chat.controller.js";

const router=Router();

router.route('/createPrivateChat').post(authenticate,createPrivateChat);
router.route('/createGroupChat').post(authenticate,upload.single("grpImage"),createGroupChat);
router.route('/inbox').get(authenticate,getChatList);
router.route('/:chatId').get(authenticate,getChat);
router.route('/:chatId/editGrpIcon').post(authenticate,upload.single("grpImage"),changeGroupImage);
router.route('/:chatId/editGrpName').post(authenticate,changeGrpName);
router.route('/:chatId/addMembers').post(authenticate,addMembers);
router.route('/:chatId/removeMembers').post(authenticate,removeMembers);
router.route('/:chatId/deleteGrpChat').post(authenticate,deleteGrpChat);
router.route('/:chatId/exitGrpChat').post(authenticate,exitGrpChat);


export default router;