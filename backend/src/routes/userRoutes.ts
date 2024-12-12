import { Router } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();

userRouter.post('/create', UserController.create);
userRouter.post('/login', UserController.login);
userRouter.get('/readall', UserController.readAll);
userRouter.get('/read/:id', UserController.readOne);
userRouter.put('/update/:id', UserController.update);
userRouter.delete('/delete/:id', UserController.delete);

export default userRouter;