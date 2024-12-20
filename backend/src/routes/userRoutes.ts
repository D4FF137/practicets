import { Router } from "express";
import UserController from "../controllers/userController";
import { adminMiddleware, authMiddleware, hostesMiddleware } from "../middleware/authMiddleware";
import {upload} from '../controllers/userController'

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Создать пользователя
 *     description: Создает нового пользователя.
 *     tags: [Users]
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
 *     tags: [Users]
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
 *     tags: [Users]
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
 * /user/read/username/{username}:
 *   get:
 *     summary: Получить пользователя по username
 *     description: Возвращает пользователя по указанному username.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           description: Username пользователя
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
userRouter.get('/read/username/:username', authMiddleware, hostesMiddleware, UserController.readByUsername);

/**
 * @swagger
 * /user/read/id/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     description: Возвращает пользователя по указанному ID.
 *     tags: [Users]
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
userRouter.get('/read/id/:id', authMiddleware, hostesMiddleware, UserController.readOne);

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Обновить пользователя
 *     description: Обновляет пользователя по указанному ID.
 *     tags: [Users]
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
 *     tags: [Users]
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

/**
 * @swagger
 * /user/change-password/{id}:
 *   post:
 *     summary: Сменить пароль пользователя
 *     description: Позволяет пользователю сменить свой пароль.
 *     tags: [Users]
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
 *               currentPassword:
 *                 type: string
 *                 description: Текущий пароль пользователя
 *               newPassword:
 *                 type: string
 *                 description: Новый пароль пользователя
 *               confirmNewPassword:
 *                 type: string
 *                 description: Подтверждение нового пароля
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Неверный текущий пароль
 *       404:
 *         description: Пользователь не найден
 */
userRouter.post('/change-password/:id', authMiddleware, UserController.changePassword);

/**
 * @swagger
 * /user/{id}/avatar:
 *   put:
 *     summary: Загрузка аватарки пользователя
 *     description: Позволяет загрузить аватарку пользователю.
 *     tags: [Users]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Файл аватарки (только JPEG, JPG, PNG, до 5MB)
 *     responses:
 *       200:
 *         description: Аватар успешно загружен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Аватар успешно загружен
 *                 avatarPath:
 *                   type: string
 *                   example: uploads/avatars/1698765432109.png
 *       400:
 *         description: Файл не был загружен или недопустимый формат
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Файл не был загружен
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ошибка сервера
 */
userRouter.put('/:id/avatar', authMiddleware, upload.single('avatar'), UserController.uploadAvatar);

export default userRouter;