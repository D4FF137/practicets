import { Request, Response } from 'express';
import Role, { IRole } from "../models/Role";
import { z } from 'zod';

const roleValidationSchema = z.object({
    name: z.string().min(3).max(15)
});

export default class roleController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = roleValidationSchema.parse(req.body);

            const role = new Role({
                name: validatedData.name
            });

            await role.save();

            return res.status(201).json({ msg: 'Роль создана' });
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
            const roles = await Role.find();
            return res.status(200).json(roles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async readOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const role = await Role.findOne({ roleID: id });

            if (!role) {
                return res.status(404).json({ error: 'Роль не найдена' });
            }

            return res.status(200).json(role);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validatedData = roleValidationSchema.parse(req.body);

            const updatedRole = await Role.findOneAndUpdate(
                { name: validatedData.name },
                { new: true }
            );

            if (!updatedRole) {
                return res.status(404).json({ error: 'Роль не найдена' });
            }

            return res.status(200).json({ msg: 'Роль обновлена', role: updatedRole });
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
            const deletedRole = await Role.findOneAndDelete({ roleID: id });

            if (!deletedRole) {
                return res.status(404).json({ error: 'Роль не найдена' });
            }

            return res.status(200).json({ msg: 'Роль удалена', role: deletedRole });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}