import express from 'express';
import PromotionsController from '../controllers/promotionsController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';
import { Router } from 'express';

const promotionsRouter = Router();

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   - name: Promotions
 *     description: Операции, связанные с промоакциями
 */

/**
 * @swagger
 * /promotions/create:
 *   post:
 *     summary: Создать промоакцию
 *     description: Создает новую промоакцию.
 *     tags:
 *       - Promotions
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
promotionsRouter.post('/create', authMiddleware, adminMiddleware, upload.single('image'), PromotionsController.create);

/**
 * @swagger
 * /promotions/readall:
 *   get:
 *     summary: Получить все промоакции
 *     description: Возвращает список всех промоакций.
 *     tags:
 *       - Promotions
 *     responses:
 *       200:
 *         description: Список промоакций
 */
promotionsRouter.get('/readall', PromotionsController.readAll);

/**
 * @swagger
 * /promotions/read/{id}:
 *   get:
 *     summary: Получить промоакцию по ID
 *     description: Возвращает промоакцию по указанному ID.
 *     tags:
 *       - Promotions
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
promotionsRouter.get('/read/:id', PromotionsController.readOne);

/**
 * @swagger
 * /promotions/update/{id}:
 *   put:
 *     summary: Обновить промоакцию
 *     description: Обновляет промоакцию по указанному ID.
 *     tags:
 *       - Promotions
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
promotionsRouter.put('/update/:id', authMiddleware, adminMiddleware, upload.single('image'), PromotionsController.update);

/**
 * @swagger
 * /promotions/delete/{id}:
 *   delete:
 *     summary: Удалить промоакцию
 *     description: Удаляет промоакцию по указанному ID.
 *     tags:
 *       - Promotions
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
promotionsRouter.delete('/delete/:id', authMiddleware, adminMiddleware, PromotionsController.delete);

export default promotionsRouter;