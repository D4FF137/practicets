"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.configDotenv)();
const userValidationSchema = zod_1.z.object({
    username: zod_1.z.string().min(5).max(20),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, 'Некорректный формат номера телефона. Пример: +7 (999) 123-45-67').min(11),
    password: zod_1.z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Пароль должен содержать латинские буквы (верхний и нижний регистр), цифры и хотя бы один спецсимвол (@$!%*?&)').optional(),
    roleID: zod_1.z.number().max(2),
});
class UserController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = userValidationSchema.parse(req.body);
                const roleExists = yield Role_1.default.findOne({ roleID: validatedData.roleID });
                if (!roleExists) {
                    return res.status(404).json({ error: 'Роль с указанным ID не найдена' });
                }
                const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, 5);
                const user = new User_1.default({
                    email: validatedData.email,
                    username: validatedData.username,
                    phone: validatedData.phone,
                    password: hashedPassword,
                    roleID: validatedData.roleID,
                });
                const savedUser = yield user.save();
                const payload = {
                    _id: savedUser._id,
                    username: savedUser.username,
                    roleID: savedUser.roleID,
                };
                const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: '10h' });
                return res.status(201).json({ msg: 'Пользователь успешно создан', token });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ errors: error.errors });
                }
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield User_1.default.findOne({ email: email });
                if (!user) {
                    return res.status(404).json({ msg: 'Пользователь не найден' });
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ msg: 'Неверный пароль' });
                }
                const payload = {
                    _id: user._id,
                    username: user.username,
                    roleID: user.roleID
                };
                const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: '10h' });
                return res.status(200).json(Object.assign(Object.assign({}, user.toObject()), { token }));
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
    static readAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find().select('-password');
                return res.status(200).json(users);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
    static readOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield User_1.default.findById(id).select('-password');
                if (!user) {
                    return res.status(404).json({ error: 'Пользователь не найден' });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield User_1.default.findById(id);
                if (!user) {
                    return res.status(404).json({ error: 'Пользователь не найден' });
                }
                if (req.body.roleID !== undefined) {
                    const roleExists = yield Role_1.default.findOne({ roleID: req.body.roleID });
                    if (!roleExists) {
                        return res.status(404).json({ error: 'Роль с указанным ID не найдена' });
                    }
                }
                let hashedPassword;
                if (req.body.password) {
                    hashedPassword = yield bcrypt_1.default.hash(req.body.password, 5);
                }
                const updatedFields = {};
                if (req.body.username !== undefined)
                    updatedFields.username = req.body.username;
                if (req.body.email !== undefined)
                    updatedFields.email = req.body.email;
                if (req.body.phone !== undefined)
                    updatedFields.phone = req.body.phone;
                if (hashedPassword !== undefined)
                    updatedFields.password = hashedPassword;
                if (req.body.roleID !== undefined)
                    updatedFields.roleID = req.body.roleID;
                const updatedUser = yield User_1.default.findByIdAndUpdate(id, updatedFields, { new: true }).select('-password');
                return res.status(200).json({ msg: 'Пользователь обновлен', user: updatedUser });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ errors: error.errors });
                }
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield User_1.default.findById(id);
                if (!user) {
                    return res.status(404).json({ error: 'Пользователь не найден' });
                }
                yield user.deleteOne();
                return res.status(200).json({ msg: 'Пользователь удален', user });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
}
exports.default = UserController;
