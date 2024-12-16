"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostesMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Получаем токен из заголовка
        if (!token) {
            return res.status(401).json({ error: 'Пользователь неавторизован. Доступ запрещен.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || user.roleID !== 1) {
        return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
const hostesMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || (user.roleID !== 1 && user.roleID !== 2)) {
        return res.status(403).json({ error: "Доступ запрещен. Требуются права хостес или администратора" });
    }
    next();
};
exports.hostesMiddleware = hostesMiddleware;
