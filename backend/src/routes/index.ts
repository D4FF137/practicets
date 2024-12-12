import { Router } from "express";
import userRouter from "./userRoutes";
import roleRouter from "./roleRoutes";
import nomerRouter from "./nomerRoutes";
import promotionsRouter from './promotionsRoutes'

const router = Router();

router.use('/user', userRouter);
router.use('/role', roleRouter);
router.use('/nomer', nomerRouter);
router.use('/promotions', promotionsRouter)

export default router;