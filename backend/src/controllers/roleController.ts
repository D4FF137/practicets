import { Request, Response } from 'express';
import Role, { IRole } from "../models/Role";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { z } from 'zod';

configDotenv()

const roleValdiationSchema = z.object({
    roleID: z.number(),
    roleName: z.string().min(3).max(15)
})

export default class roleController{
    static async create(req: Request, res: Response) {
        try {
            const validatedData = roleValdiationSchema.parse(req.body);

            const role = new Role({
                roleID: validatedData.roleID,
                roleName: validatedData.roleName
            });

            await role.save();

            return res.status(201).json({msg: 'Роль создана'})
        } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors })
        }
        console.error(error);
        return res.status(500).json({error: 'Ошибка сервера'})    
        }
    }
}