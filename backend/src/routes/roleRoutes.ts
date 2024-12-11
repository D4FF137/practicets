import { Router } from "express";
import RoleController from "../controllers/roleController";

const roleRouter = Router();

roleRouter.post('/create', RoleController.create);

export default roleRouter;