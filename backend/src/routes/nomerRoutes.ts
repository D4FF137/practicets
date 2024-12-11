import { Router } from "express";
import NomerController from "../controllers/nomerController";

const nomerRouter = Router();

nomerRouter.post('/create', NomerController.create);

export default nomerRouter;