import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    changeUserDetails,
    changePassword,
    changeAvatar,
    deleteUser,
    authMe,
    getOnlineUsers
} from "../controllers/user.controller.js";

const router=Router();

router.route('/register').post(upload.single("avatar"),registerUser);
router.route('/login').post(loginUser);
router.route("/online").get(getOnlineUsers);
//Secured Routes
router.route('/auth/me').get(authenticate,authMe);
router.route('/profile').get(authenticate,getUserProfile);
router.route('/logout').post(authenticate,logoutUser);
router.route('/editProfile').post(authenticate,changeUserDetails);
router.route('/changePassword').post(authenticate,changePassword);
router.route('/changeAvatar').post(authenticate,upload.single("avatar"),changeAvatar);
router.route('/deleteUser').post(authenticate,deleteUser);
export default router;