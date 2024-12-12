import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

declare module 'express' {
    interface Request {
        user?: {
            _id: string;
            username: string;
            roleID: number;
        };
    }
}

interface TokenPayload {
    _id: string;
    username: string;
    roleID: number; 
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

        if (!token) {
            return res.status(401).json({ error: 'Пользователь неавторизован. Доступ запрещен.' });
        }

        const decoded = jwt.verify(token, process.env.SECRET as string) as TokenPayload;
        req.user = decoded; 

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as TokenPayload; 

    if (!user || user.roleID !== 1) {
        return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
    }

    next();
};
export const hostesMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as TokenPayload;

    if (!user || (user.roleID !== 1 && user.roleID !== 2)) {
        return res.status(403).json({error: "Доступ запрещен. Требуются права хостес или администратора"})
    }

    next();
}