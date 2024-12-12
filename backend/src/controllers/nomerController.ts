import { Request, Response } from 'express';
import Nomer, { INomer } from "../models/Nomer";
import { z } from 'zod';

const nomerValidationSchema = z.object({
    nameNomer: z.string().min(3).max(15),
});

export default class NomerController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = nomerValidationSchema.parse(req.body);

            const nomer = new Nomer({
                nameNomer: validatedData.nameNomer,
            });

            const savedNomer = await nomer.save();

            return res.status(201).json({ msg: 'Номер создан', uuid: savedNomer.uuidNomer });
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
            const validatedData = nomerValidationSchema.parse(req.body);

            const updatedNomer = await Nomer.findOneAndUpdate(
                { uuidNomer: uuid },
                { nameNomer: validatedData.nameNomer },
                { new: true }
            );

            if (!updatedNomer) {
                return res.status(404).json({ error: 'Номер не найден' });
            }

            return res.status(200).json({ msg: 'Номер обновлен', nomer: updatedNomer });
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

            return res.status(200).json({ msg: 'Номер удален', nomer: deletedNomer });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}