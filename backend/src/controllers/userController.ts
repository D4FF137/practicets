import { Request, Response } from 'express';
import User, { IUser } from "../models/User";
import Role, { IRole } from '../models/Role';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { z } from 'zod';
import mongoose from 'mongoose';
import multer from 'multer'
import path from 'path'

configDotenv();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Только изображения в формате JPEG и PNG разрешены'));
    }
});
const changePasswordSchema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Пароль должен содержать латинские буквы (верхний и нижний регистр), цифры и хотя бы один спецсимвол (@$!%*?&)'
    ),
    confirmNewPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Новый пароль и подтверждение не совпадают',
    path: ['confirmNewPassword'],
});
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
    roleID: z.string(),
});

export default class UserController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = userValidationSchema.parse(req.body);

            const roleExists: IRole | null = await Role.findById(validatedData.roleID);
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

            const user: IUser | null = await User.findOne({ email });
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
                roleID: user.roleID,
            };
            const token = await jwt.sign(payload, process.env.SECRET as string, { expiresIn: '10h' });

            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            return res.status(200).json({ ...userWithoutPassword, token });
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
    
            // Проверка, является ли id корректным ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Некорректный формат ID' });
            }
    
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
                const roleExists: IRole | null = await Role.findById(req.body.roleID);
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

            return res.status(200).json({ msg: 'Пользователь удален' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
    static async readByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params;
    
            const user = await User.findOne({ username }).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
    
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
    static async changePassword(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword, confirmNewPassword } = req.body;
    
            const validatedData = changePasswordSchema.parse({ currentPassword, newPassword, confirmNewPassword });
    
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
    
            const passwordMatch = await bcrypt.compare(validatedData.currentPassword, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ msg: 'Текущий пароль неверный' });
            }
    
            const hashedPassword = await bcrypt.hash(validatedData.newPassword, 5);
    
            user.password = hashedPassword;
            await user.save();
    
            return res.status(200).json({ msg: 'Пароль успешно изменен' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
    static async uploadAvatar(req: Request, res: Response) {
        try {
            const { id } = req.params;
    
            // Проверка, существует ли пользователь
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
    
            // Если файл был загружен, сохраните путь к файлу в пользователе
            if (req.file) {
                user.avatar = req.file.path;
                await user.save();
                return res.status(200).json({ msg: 'Аватар успешно загружен', avatarPath: req.file.path });
            } else {
                return res.status(400).json({ error: 'Файл не был загружен' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}