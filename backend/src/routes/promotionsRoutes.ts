import express from 'express';
import PromotionsController from '../controllers/promotionsController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';
import { Router } from 'express';

const promotionsRouter = Router();

const upload = multer({ dest: 'uploads/' });

promotionsRouter.post('/create', authMiddleware, adminMiddleware, upload.single('image'), PromotionsController.create); 
promotionsRouter.get('/readall', PromotionsController.readAll); 
promotionsRouter.get('/read/:id', PromotionsController.readOne); 
promotionsRouter.put('/update/:id', authMiddleware, adminMiddleware, upload.single('image'), PromotionsController.update);
promotionsRouter.delete('/delete/:id', authMiddleware, adminMiddleware, PromotionsController.delete);

export default promotionsRouter;