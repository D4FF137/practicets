import { Router } from "express";
import bookingController from "../controllers/bookingController";
import { authMiddleware, adminMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const bookingRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API для управления бронированиями
 */

/**
 * @swagger
 * /booking/create:
 *   post:
 *     summary: Создать бронирование
 *     description: Создает новое бронирование.
 *     tags: [Bookings]
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
bookingRouter.post('/create', authMiddleware, bookingController.create);

/**
 * @swagger
 * /booking/readall:
 *   get:
 *     summary: Получить все бронирования
 *     description: Возвращает список всех бронирований.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список бронирований
 *       401:
 *         description: Пользователь не авторизован
 */
bookingRouter.get('/readall', authMiddleware, hostesMiddleware, bookingController.readAll);

/**
 * @swagger
 * /booking/read/{id}:
 *   get:
 *     summary: Получить бронирование по ID
 *     description: Возвращает бронирование по указанному ID.
 *     tags: [Bookings]
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
bookingRouter.get('/read/:id', authMiddleware, hostesMiddleware, bookingController.readOne);

/**
 * @swagger
 * /booking/update/{id}:
 *   put:
 *     summary: Обновить бронирование
 *     description: Обновляет бронирование по указанному ID.
 *     tags: [Bookings]
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
bookingRouter.put('/update/:id', authMiddleware, hostesMiddleware, bookingController.update);

/**
 * @swagger
 * /booking/delete/{id}:
 *   delete:
 *     summary: Удалить бронирование
 *     description: Удаляет бронирование по указанному ID.
 *     tags: [Bookings]
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
bookingRouter.delete('/delete/:id', authMiddleware, hostesMiddleware, bookingController.delete);

export default bookingRouter;