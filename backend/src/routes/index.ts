import { Router } from "express";
import userRouter from "./userRoutes";
import roleRouter from "./roleRoutes";
import nomerRouter from "./nomerRoutes";

const router = Router();

router.use('/user', userRouter);
router.use('/role', roleRouter);
router.use('/nomer', nomerRouter);

export default router;