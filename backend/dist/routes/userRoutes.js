"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRouter = (0, express_1.Router)();
/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Создать пользователя
 *     description: Создает нового пользователя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               roleID:
 *                 type: number
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Неверные данные
 */
userRouter.post('/create', userController_1.default.create);
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Авторизует пользователя и возвращает токен.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Авторизация успешна
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Неверный пароль
 *       404:
 *         description: Пользователь не найден
 */
userRouter.post('/login', userController_1.default.login);
/**
 * @swagger
 * /user/readall:
 *   get:
 *     summary: Получить всех пользователей
 *     description: Возвращает список всех пользователей.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       401:
 *         description: Пользователь не авторизован
 */
userRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, userController_1.default.readAll);
/**
 * @swagger
 * /user/read/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     description: Возвращает пользователя по указанному ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
userRouter.get('/read/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, userController_1.default.readOne);
/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Обновить пользователя
 *     description: Обновляет пользователя по указанному ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               roleID:
 *                 type: number
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
userRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, userController_1.default.update);
/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     description: Удаляет пользователя по указанному ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
userRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, userController_1.default.delete);
exports.default = userRouter;
