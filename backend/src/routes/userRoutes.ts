import { Router } from "express";
import UserController from "../controllers/userController";
import { adminMiddleware, authMiddleware, hostesMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

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
 *                 type: string
 *                 description: ID роли пользователя (ObjectId)
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Неверные данные
 */
userRouter.post('/create', UserController.create);

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
userRouter.post('/login', UserController.login);

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
userRouter.get('/readall', authMiddleware, hostesMiddleware, UserController.readAll);

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
 *           description: ID пользователя (ObjectId)
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
userRouter.get('/read/:id', authMiddleware, hostesMiddleware, UserController.readOne);

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
 *           description: ID пользователя (ObjectId)
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
 *                 type: string
 *                 description: ID роли пользователя (ObjectId)
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
userRouter.put('/update/:id', authMiddleware, adminMiddleware, UserController.update);

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
 *           description: ID пользователя (ObjectId)
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
userRouter.delete('/delete/:id', authMiddleware, adminMiddleware, UserController.delete);

export default userRouter;