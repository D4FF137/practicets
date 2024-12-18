import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import Role from '../models/Role'; // Импортируем модель Role

configDotenv();

declare module 'express' {
    interface Request {
        user?: {
            _id: string;
            username: string;
            roleID: string; // ObjectId роли
        };
    }
}

interface TokenPayload {
    _id: string;
    username: string;
    roleID: string; // ObjectId роли
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

        if (!token) {
            return res.status(401).json({ error: 'Пользователь неавторизован. Доступ запрещен.' });
        }

        const decoded = jwt.verify(token, process.env.SECRET as string) as TokenPayload;
        req.user = decoded; // Сохраняем декодированные данные в объект запроса

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as TokenPayload;

        if (!user) {
            return res.status(401).json({ error: 'Пользователь неавторизован' });
        }

        // Ищем роль в базе данных по roleID
        const role = await Role.findById(user.roleID);

        if (!role || role.name !== 'Администратор') {
            return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const hostesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as TokenPayload;

        if (!user) {
            return res.status(401).json({ error: 'Пользователь неавторизован' });
        }

        // Ищем роль в базе данных по roleID
        const role = await Role.findById(user.roleID);

        if (!role || (role.name !== 'Хостес' && role.name !== 'Администратор')) {
            return res.status(403).json({ error: 'Доступ запрещен. Требуются права хостес или администратора' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};