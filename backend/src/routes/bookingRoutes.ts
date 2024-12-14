import { Router } from "express";
import bookingController from "../controllers/bookingController";
import { authMiddleware, adminMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const bookingRouter = Router();

bookingRouter.post('/create', authMiddleware, bookingController.create);
bookingRouter.get('/readall', authMiddleware, hostesMiddleware, bookingController.readAll);
bookingRouter.get('/read/:id', authMiddleware, hostesMiddleware, bookingController.readOne);
bookingRouter.put('/update/:id', authMiddleware, hostesMiddleware, bookingController.update);
bookingRouter.delete('/delete/:id', authMiddleware, hostesMiddleware, bookingController.delete);

export default bookingRouter;