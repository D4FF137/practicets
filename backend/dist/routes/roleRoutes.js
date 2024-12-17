"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = __importDefault(require("../controllers/roleController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleRouter = (0, express_1.Router)();
/**
 * @swagger
 * /role/create:
 *   post:
 *     summary: Создать роль
 *     description: Создает новую роль.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleID:
 *                 type: number
 *               roleName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Роль успешно создана
 *       400:
 *         description: Неверные данные
 */
roleRouter.post('/create', roleController_1.default.create);
/**
 * @swagger
 * /role/readall:
 *   get:
 *     summary: Получить все роли
 *     description: Возвращает список всех ролей.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список ролей
 *       401:
 *         description: Пользователь не авторизован
 */
roleRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.readAll);
/**
 * @swagger
 * /role/read/{id}:
 *   get:
 *     summary: Получить роль по ID
 *     description: Возвращает роль по указанному ID.
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
 *         description: Роль найдена
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Роль не найдена
 */
roleRouter.get('/read/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.readOne);
/**
 * @swagger
 * /role/update/{id}:
 *   put:
 *     summary: Обновить роль
 *     description: Обновляет роль по указанному ID.
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
 *               roleName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Роль успешно обновлена
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Роль не найдена
 */
roleRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.update);
/**
 * @swagger
 * /role/delete/{id}:
 *   delete:
 *     summary: Удалить роль
 *     description: Удаляет роль по указанному ID.
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
 *         description: Роль успешно удалена
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Роль не найдена
 */
roleRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.delete);
exports.default = roleRouter;
