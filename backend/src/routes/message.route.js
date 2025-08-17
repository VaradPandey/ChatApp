import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createMessage,
    getMessage,
    editMessage,
    deleteMessage,
} from "../controllers/message.controller.js"

const router=Router();

router.route('/createMessage').post(authenticate,upload.single("mediaUrl"),createMessage);
router.route('/:messageId').get(authenticate,getMessage);
router.route('/:messageId').post(authenticate,editMessage);
router.route('/:messageId/del').post(authenticate,deleteMessage);

export default router;