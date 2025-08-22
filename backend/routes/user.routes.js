import { Router } from "express";
import {
  registerUserController,
  verifyEmailController,
  loginController,
  logOutController,
  uploadAvatar,
  updateUserDetails,
} from "../controller/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logOutController);
userRouter.put("upload-avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.put("/update-user", auth, updateUserDetails);

export default userRouter;
