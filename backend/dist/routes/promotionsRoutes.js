"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promotionsController_1 = __importDefault(require("../controllers/promotionsController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const promotionsRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
/**
 * @swagger
 * /promotions/create:
 *   post:
 *     summary: Создать промоакцию
 *     description: Создает новую промоакцию.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Промоакция успешно создана
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 */
promotionsRouter.post('/create', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, upload.single('image'), promotionsController_1.default.create);
/**
 * @swagger
 * /promotions/readall:
 *   get:
 *     summary: Получить все промоакции
 *     description: Возвращает список всех промоакций.
 *     responses:
 *       200:
 *         description: Список промоакций
 */
promotionsRouter.get('/readall', promotionsController_1.default.readAll);
/**
 * @swagger
 * /promotions/read/{id}:
 *   get:
 *     summary: Получить промоакцию по ID
 *     description: Возвращает промоакцию по указанному ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Промоакция найдена
 *       404:
 *         description: Промоакция не найдена
 */
promotionsRouter.get('/read/:id', promotionsController_1.default.readOne);
/**
 * @swagger
 * /promotions/update/{id}:
 *   put:
 *     summary: Обновить промоакцию
 *     description: Обновляет промоакцию по указанному ID.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Промоакция успешно обновлена
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Промоакция не найдена
 */
promotionsRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, upload.single('image'), promotionsController_1.default.update);
/**
 * @swagger
 * /promotions/delete/{id}:
 *   delete:
 *     summary: Удалить промоакцию
 *     description: Удаляет промоакцию по указанному ID.
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
 *         description: Промоакция успешно удалена
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Промоакция не найдена
 */
promotionsRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, promotionsController_1.default.delete);
exports.default = promotionsRouter;
