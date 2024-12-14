import { Router } from "express";
import NomerController from "../controllers/nomerController";
import { adminMiddleware, authMiddleware, hostesMiddleware } from "../middleware/authMiddleware";


const nomerRouter = Router();

nomerRouter.post('/create', authMiddleware, hostesMiddleware, NomerController.create);
nomerRouter.get('/readall', authMiddleware, hostesMiddleware, NomerController.readAll);
nomerRouter.get('read/:uuid', authMiddleware, hostesMiddleware,NomerController.readOne);
nomerRouter.put('/update/:uuid', authMiddleware,hostesMiddleware,NomerController.update);
nomerRouter.delete('/delete/:uuid', authMiddleware, adminMiddleware, NomerController.delete)

export default nomerRouter;