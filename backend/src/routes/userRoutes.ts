import { Router } from "express";
import UserController from "../controllers/userController"; // Убедитесь, что путь корректен

const userRouter = Router();

userRouter.post('/create', UserController.create);
userRouter.post('/login', UserController.login);

export default userRouter;