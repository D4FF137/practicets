import { Router } from "express";
import UserController from "../controllers/userController";
import { adminMiddleware, authMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.post('/create', UserController.create);
userRouter.post('/login', UserController.login);
userRouter.get('/readall', authMiddleware, hostesMiddleware, UserController.readAll);
userRouter.get('/read/:id', authMiddleware, hostesMiddleware,UserController.readOne);
userRouter.put('/update/:id', authMiddleware,adminMiddleware ,UserController.update);
userRouter.delete('/delete/:id', authMiddleware, adminMiddleware, UserController.delete);

export default userRouter;