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
const Role_1 = __importDefault(require("../models/Role"));
const zod_1 = require("zod");
const roleValidationSchema = zod_1.z.object({
    roleID: zod_1.z.number(),
    roleName: zod_1.z.string().min(3).max(15)
});
class roleController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = roleValidationSchema.parse(req.body);
                const role = new Role_1.default({
                    roleID: validatedData.roleID,
                    roleName: validatedData.roleName
                });
                yield role.save();
                return res.status(201).json({ msg: 'Роль создана' });
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
    static readAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield Role_1.default.find();
                return res.status(200).json(roles);
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
                const role = yield Role_1.default.findOne({ roleID: id });
                if (!role) {
                    return res.status(404).json({ error: 'Роль не найдена' });
                }
                return res.status(200).json(role);
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
                const validatedData = roleValidationSchema.parse(req.body);
                const updatedRole = yield Role_1.default.findOneAndUpdate({ roleID: id }, { roleName: validatedData.roleName }, { new: true });
                if (!updatedRole) {
                    return res.status(404).json({ error: 'Роль не найдена' });
                }
                return res.status(200).json({ msg: 'Роль обновлена', role: updatedRole });
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
                const deletedRole = yield Role_1.default.findOneAndDelete({ roleID: id });
                if (!deletedRole) {
                    return res.status(404).json({ error: 'Роль не найдена' });
                }
                return res.status(200).json({ msg: 'Роль удалена', role: deletedRole });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
}
exports.default = roleController;
