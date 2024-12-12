import { Router } from "express";
import RoleController from "../controllers/roleController";

const roleRouter = Router();

roleRouter.post('/create', RoleController.create);
roleRouter.get('/readall', RoleController.readAll);
roleRouter.get('/read/:id', RoleController.readOne);
roleRouter.put('/update/:id', RoleController.update);
roleRouter.delete('/delete/:id', RoleController.delete);

export default roleRouter;