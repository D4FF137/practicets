"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = __importDefault(require("../controllers/bookingController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const bookingRouter = (0, express_1.Router)();
/**
 * @swagger
 * /booking/create:
 *   post:
 *     summary: Создать бронирование
 *     description: Создает новое бронирование.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               nomer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Бронирование успешно создано
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 */
bookingRouter.post('/create', authMiddleware_1.authMiddleware, bookingController_1.default.create);
/**
 * @swagger
 * /booking/readall:
 *   get:
 *     summary: Получить все бронирования
 *     description: Возвращает список всех бронирований.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список бронирований
 *       401:
 *         description: Пользователь не авторизован
 */
bookingRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.readAll);
/**
 * @swagger
 * /booking/read/{id}:
 *   get:
 *     summary: Получить бронирование по ID
 *     description: Возвращает бронирование по указанному ID.
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
 *         description: Бронирование найдено
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Бронирование не найдено
 */
bookingRouter.get('/read/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.readOne);
/**
 * @swagger
 * /booking/update/{id}:
 *   put:
 *     summary: Обновить бронирование
 *     description: Обновляет бронирование по указанному ID.
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
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *     responses:
 *       200:
 *         description: Бронирование обновлено
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Бронирование не найдено
 */
bookingRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.update);
/**
 * @swagger
 * /booking/delete/{id}:
 *   delete:
 *     summary: Удалить бронирование
 *     description: Удаляет бронирование по указанному ID.
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
 *         description: Бронирование удалено
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Бронирование не найдено
 */
bookingRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.delete);
exports.default = bookingRouter;
