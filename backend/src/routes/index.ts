import { Router } from "express";
import userRouter from "./userRoutes"; // Убедитесь, что путь корректен

const router = Router();

router.use('/user', userRouter);

export default router;