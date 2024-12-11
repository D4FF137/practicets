import { Request, Response } from 'express';
import User, { IUser } from "../models/User";
import Role, {IRole} from '../models/Role'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { z } from 'zod';

configDotenv();

const userValidationSchema = z.object({
    username: z.string().min(5).max(20),
    email: z.string().email(),
    phone: z.string().regex(
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
        'Некорректный формат номера телефона. Пример: +7 (999) 123-45-67'
    ),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Пароль должен содержать латинские буквы (верхний и нижний регистр), цифры и хотя бы один спецсимвол (@$!%*?&)'
    ),
    roleID: z.number().max(2), 
});

export default class UserController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = userValidationSchema.parse(req.body);

            const roleExists: IRole | null = await Role.findOne({ roleID: validatedData.roleID });
            if (!roleExists) {
                return res.status(404).json({ error: 'Роль с указанным ID не найдена' });
            }

            const hashedPassword = await bcrypt.hash(validatedData.password, 5);

            const user = new User({
                email: validatedData.email,
                username: validatedData.username,
                phone: validatedData.phone,
                password: hashedPassword,
                roleID: validatedData.roleID, 
            });

            const savedUser = await user.save();

            const roleName = roleExists.roleName;

            return res.status(201).json({ msg: 'Пользователь успешно создан', roleName });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const finded: IUser | null = await User.findOne({ email: email });
            if (!finded) {
                return res.status(404).json({ msg: 'Пользователь не найден' });
            }
            const findedByPassword = await bcrypt.compare(password, finded.password);
            if (!findedByPassword) {
                return res.status(404).json({ msg: 'Неверный пароль' });
            }
            const payload = {
                _id: finded._id,
                username: finded.username,
            };
            const token = await jwt.sign(payload, process.env.SECRET as string, { expiresIn: '10h' });
            return res.status(200).json({ ...finded.toObject(), token });
        } catch (error) {
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}