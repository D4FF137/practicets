import { Router } from "express";
import NomerController from "../controllers/nomerController";
import { adminMiddleware, authMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const nomerRouter = Router();

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
nomerRouter.post('/create', authMiddleware, hostesMiddleware, NomerController.create);

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
nomerRouter.get('/readall', authMiddleware, hostesMiddleware, NomerController.readAll);

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
nomerRouter.get('/read/:uuid', authMiddleware, hostesMiddleware, NomerController.readOne);

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
nomerRouter.put('/update/:uuid', authMiddleware, hostesMiddleware, NomerController.update);

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
nomerRouter.delete('/delete/:uuid', authMiddleware, adminMiddleware, NomerController.delete);

export default nomerRouter;