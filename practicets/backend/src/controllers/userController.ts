import { Request, Response } from 'express';
import User, { IUser } from "../models/User";
import Role, { IRole } from '../models/Role';
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
    ).min(11),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Пароль должен содержать латинские буквы (верхний и нижний регистр), цифры и хотя бы один спецсимвол (@$!%*?&)'
    ).optional(),
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
    
            const hashedPassword = await bcrypt.hash(validatedData.password as string, 5);
    
                const user = new User({
                email: validatedData.email,
                username: validatedData.username,
                phone: validatedData.phone,
                password: hashedPassword,
                roleID: validatedData.roleID,
            });
    
            const savedUser = await user.save();
    
            const payload = {
                _id: savedUser._id,
                username: savedUser.username,
                roleID: savedUser.roleID,
            };
            const token = await jwt.sign(payload, process.env.SECRET as string, { expiresIn: '10h' });
    
            return res.status(201).json({ msg: 'Пользователь успешно создан', token });
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
            const user: IUser | null = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ msg: 'Пользователь не найден' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ msg: 'Неверный пароль' });
            }
            const payload = {
                _id: user._id,
                username: user.username,
                roleID: user.roleID
            };
            const token = await jwt.sign(payload, process.env.SECRET as string, { expiresIn: '10h' });
            return res.status(200).json({ ...user.toObject(), token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async readAll(req: Request, res: Response) {
        try {
            const users = await User.find().select('-password');
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async readOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            if (req.body.roleID !== undefined) {
                const roleExists: IRole | null = await Role.findOne({ roleID: req.body.roleID });
                if (!roleExists) {
                    return res.status(404).json({ error: 'Роль с указанным ID не найдена' });
                }
            }
            let hashedPassword: string | undefined;
            if (req.body.password) {
                hashedPassword = await bcrypt.hash(req.body.password, 5);
            }
            const updatedFields: Partial<IUser> = {};
            if (req.body.username !== undefined) updatedFields.username = req.body.username;
            if (req.body.email !== undefined) updatedFields.email = req.body.email;
            if (req.body.phone !== undefined) updatedFields.phone = req.body.phone;
            if (hashedPassword !== undefined) updatedFields.password = hashedPassword;
            if (req.body.roleID !== undefined) updatedFields.roleID = req.body.roleID;
            const updatedUser = await User.findByIdAndUpdate(
                id,
                updatedFields,
                { new: true }
            ).select('-password');
            return res.status(200).json({ msg: 'Пользователь обновлен', user: updatedUser });
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
            const user = await User.findById(id);
    
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
    
            await user.deleteOne();
    
            return res.status(200).json({ msg: 'Пользователь удален', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}