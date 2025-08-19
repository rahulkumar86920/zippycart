import { Router } from "express";
import {
  registerUserController,
  verifyEmailController,
  loginController,
  logOutController,
} from "../controller/user.controller.js";
import auth from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logOutController);

export default userRouter;
