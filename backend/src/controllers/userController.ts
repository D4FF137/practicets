import { Request, Response } from 'express';
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export default class UserController {
    static async create(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            const hashed = await bcrypt.hash(password, 5);
            const user = new User({
                email,
                username,
                password: hashed
            });
            await user.save();
            return res.status(201).json({ msg: 'Создан' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const finded: IUser | null = await User.findOne({email: email});
            if (!finded) {
                return res.status(404).json({ msg: 'Не найден' });
            }
            const findedByPassword = await bcrypt.compare(password, finded.password);
            if (!findedByPassword) {
                return res.status(404).json({ msg: 'Не найден' });
            }
            const payload = {
                _id: finded._id,
                username: finded.username
            };
            const token = await jwt.sign(payload, process.env.SECRET as string, { expiresIn: '10h' });
            return res.status(200).json({ ...finded.toObject(), token });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}