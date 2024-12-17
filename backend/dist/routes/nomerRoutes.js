"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nomerController_1 = __importDefault(require("../controllers/nomerController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const nomerRouter = (0, express_1.Router)();
/**
 * @swagger
 * /nomer/create:
 *   post:
 *     summary: Создать номер
 *     description: Создает новый номер.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameNomer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Номер успешно создан
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 */
nomerRouter.post('/create', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.create);
/**
 * @swagger
 * /nomer/readall:
 *   get:
 *     summary: Получить все номера
 *     description: Возвращает список всех номеров.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список номеров
 *       401:
 *         description: Пользователь не авторизован
 */
nomerRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.readAll);
/**
 * @swagger
 * /nomer/read/{uuid}:
 *   get:
 *     summary: Получить номер по UUID
 *     description: Возвращает номер по указанному UUID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Номер найден
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Номер не найден
 */
nomerRouter.get('/read/:uuid', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.readOne);
/**
 * @swagger
 * /nomer/update/{uuid}:
 *   put:
 *     summary: Обновить номер
 *     description: Обновляет номер по указанному UUID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
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
 *               nameNomer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Номер успешно обновлен
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Номер не найден
 */
nomerRouter.put('/update/:uuid', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.update);
/**
 * @swagger
 * /nomer/delete/{uuid}:
 *   delete:
 *     summary: Удалить номер
 *     description: Удаляет номер по указанному UUID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Номер успешно удален
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Номер не найден
 */
nomerRouter.delete('/delete/:uuid', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, nomerController_1.default.delete);
exports.default = nomerRouter;
