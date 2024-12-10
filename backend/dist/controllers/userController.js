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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
class UserController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const hashed = yield bcrypt_1.default.hash(password, 5);
                const user = new User_1.default({
                    email,
                    username,
                    password: hashed
                });
                yield user.save();
                return res.status(201).json({ msg: 'Создан' });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const finded = yield User_1.default.findOne({ email: email });
                if (!finded) {
                    return res.status(404).json({ msg: 'Не найден' });
                }
                const findedByPassword = yield bcrypt_1.default.compare(password, finded.password);
                if (!findedByPassword) {
                    return res.status(404).json({ msg: 'Не найден' });
                }
                const payload = {
                    _id: finded._id,
                    username: finded.username
                };
                const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: '10h' });
                return res.status(200).json(Object.assign(Object.assign({}, finded.toObject()), { token }));
            }
            catch (error) {
                return res.status(500).json({ error });
            }
        });
    }
}
exports.default = UserController;
