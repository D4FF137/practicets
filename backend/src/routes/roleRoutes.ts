import { Router } from "express";
import RoleController from "../controllers/roleController";
import { authMiddleware, adminMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const roleRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Управление ролями
 */

/**
 * @swagger
 * /role/create:
 *   post:
 *     summary: Создать роль
 *     description: Создает новую роль.
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Роль успешно создана
 *       400:
 *         description: Неверные данные
 */
roleRouter.post('/create', RoleController.create);

/**
 * @swagger
 * /role/readall:
 *   get:
 *     summary: Получить все роли
 *     description: Возвращает список всех ролей.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список ролей
 *       401:
 *         description: Пользователь не авторизован
 */
roleRouter.get('/readall', authMiddleware, adminMiddleware, RoleController.readAll);

/**
 * @swagger
 * /role/read/{id}:
 *   get:
 *     summary: Получить роль по ID
 *     description: Возвращает роль по указанному ID.
 *     tags: [Roles]
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
roleRouter.get('/read/:id', authMiddleware, adminMiddleware, RoleController.readOne);

/**
 * @swagger
 * /role/update/{id}:
 *   put:
 *     summary: Обновить роль
 *     description: Обновляет роль по указанному ID.
 *     tags: [Roles]
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
 *               name:
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
roleRouter.put('/update/:id', authMiddleware, adminMiddleware, RoleController.update);

/**
 * @swagger
 * /role/delete/{id}:
 *   delete:
 *     summary: Удалить роль
 *     description: Удаляет роль по указанному ID.
 *     tags: [Roles]
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
roleRouter.delete('/delete/:id', authMiddleware, adminMiddleware, RoleController.delete);

export default roleRouter;