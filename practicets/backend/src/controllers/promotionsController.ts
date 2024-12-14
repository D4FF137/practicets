import { Request, Response } from 'express';
import Promotion, { IPromotion } from '../models/Promotions';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, uniqueSuffix + extension); 
    },
});

const upload = multer({ storage: storage });

const promotionValidationSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
});

export default class PromotionsController {
    static async create(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Файл изображения не загружен' });
            }

            const validatedData = promotionValidationSchema.parse(req.body);

            const promotion = new Promotion({
                title: validatedData.title,
                description: validatedData.description,
                image: req.file.filename, 
            });

            const savedPromotion = await promotion.save();

            return res.status(201).json({ msg: 'Промоакция создана', promotion: savedPromotion });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async readAll(req: Request, res: Response) {
        try {
            const promotions = await Promotion.find();
            return res.status(200).json(promotions);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async readOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const promotion = await Promotion.findById(id);

            if (!promotion) {
                return res.status(404).json({ error: 'Промоакция не найдена' });
            }

            return res.status(200).json(promotion);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const imagePath = req.file ? req.file.path : undefined;

            const validatedData = promotionValidationSchema.parse(req.body);

            const updatedPromotion = await Promotion.findByIdAndUpdate(
                id,
                {
                    title: validatedData.title,
                    description: validatedData.description,
                    image: imagePath,
                },
                { new: true }
            );

            if (!updatedPromotion) {
                return res.status(404).json({ error: 'Промоакция не найдена' });
            }

            return res.status(200).json({ msg: 'Промоакция обновлена', promotion: updatedPromotion });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedPromotion = await Promotion.findByIdAndDelete(id);

            if (!deletedPromotion) {
                return res.status(404).json({ error: 'Промоакция не найдена' });
            }

            return res.status(200).json({ msg: 'Промоакция удалена', promotion: deletedPromotion });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}