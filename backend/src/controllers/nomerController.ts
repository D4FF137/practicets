import { Request, Response } from 'express';
import Nomer, { INomer } from "../models/Nomer";
import { z } from 'zod';
import multer from 'multer';
import path from 'path';

const nomerValidationSchema = z.object({
    nameNomer: z.string().min(3).max(15),
    description: z.string().optional(),
    price: z.string()
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/nomer');;
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
    } else {
        cb(new Error('Только изображения разрешены'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, 
    },
});

export default class NomerController {
    static async create(req: Request, res: Response) {
        try {
            upload.single('image')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                const validatedData = nomerValidationSchema.parse(req.body);

                const nomer = new Nomer({
                    nameNomer: validatedData.nameNomer,
                    description: validatedData.description,
                    price: validatedData.price,
                    image: req.file ? req.file.path : null,
                });

                const savedNomer = await nomer.save();

                return res.status(201).json({ msg: 'Номер успешно создан', uuid: savedNomer.uuidNomer });
            });
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
            const nomers = await Nomer.find();
            return res.status(200).json(nomers);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async readOne(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const nomer = await Nomer.findOne({ uuidNomer: uuid });

            if (!nomer) {
                return res.status(404).json({ error: 'Номер не найден' });
            }

            return res.status(200).json(nomer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { uuid } = req.params;

            upload.single('image')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                const validatedData = nomerValidationSchema.parse(req.body);

                const updatedNomer = await Nomer.findOneAndUpdate(
                    { uuidNomer: uuid },
                    {
                        nameNomer: validatedData.nameNomer,
                        description: validatedData.description,
                        price: validatedData.price,
                        image: req.file ? req.file.path : undefined, // Путь к загруженному файлу
                    },
                    { new: true }
                );

                if (!updatedNomer) {
                    return res.status(404).json({ error: 'Номер не найден' });
                }

                return res.status(200).json({ msg: 'Номер успешно обновлен', nomer: updatedNomer });
            });
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
            const { uuid } = req.params;
            const deletedNomer = await Nomer.findOneAndDelete({ uuidNomer: uuid });

            if (!deletedNomer) {
                return res.status(404).json({ error: 'Номер не найден' });
            }

            return res.status(200).json({ msg: 'Номер успешно удален', nomer: deletedNomer });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}