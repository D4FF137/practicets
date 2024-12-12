import { Router } from "express";
import RoleController from "../controllers/roleController";
import { authMiddleware, adminMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const roleRouter = Router();

roleRouter.post('/create', authMiddleware, adminMiddleware, RoleController.create);
roleRouter.get('/readall', authMiddleware, adminMiddleware, RoleController.readAll);
roleRouter.get('/read/:id', authMiddleware, adminMiddleware, RoleController.readOne);
roleRouter.put('/update/:id', authMiddleware, adminMiddleware, RoleController.update);
roleRouter.delete('/delete/:id', authMiddleware, adminMiddleware, RoleController.delete);

export default roleRouter;