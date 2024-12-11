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
}