import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    registerUser,
    loginUser,
    getUserProfile,
} from "../controllers/user.controller.js";

const router=Router();

router.route('/register').post(upload.single("avatar"),registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(authenticate,getUserProfile);

export default router;