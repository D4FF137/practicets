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
const Nomer_1 = __importDefault(require("../models/Nomer"));
const zod_1 = require("zod");
const nomerValidationSchema = zod_1.z.object({
    nameNomer: zod_1.z.string().min(3).max(15),
});
class NomerController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = nomerValidationSchema.parse(req.body);
                const nomer = new Nomer_1.default({
                    nameNomer: validatedData.nameNomer,
                });
                const savedNomer = yield nomer.save();
                return res.status(201).json({ msg: 'Номер создан', uuid: savedNomer.uuidNomer });
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
                const nomers = yield Nomer_1.default.find();
                return res.status(200).json(nomers);
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
                const { uuid } = req.params;
                const nomer = yield Nomer_1.default.findOne({ uuidNomer: uuid });
                if (!nomer) {
                    return res.status(404).json({ error: 'Номер не найден' });
                }
                return res.status(200).json(nomer);
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
                const { uuid } = req.params;
                const validatedData = nomerValidationSchema.parse(req.body);
                const updatedNomer = yield Nomer_1.default.findOneAndUpdate({ uuidNomer: uuid }, { nameNomer: validatedData.nameNomer }, { new: true });
                if (!updatedNomer) {
                    return res.status(404).json({ error: 'Номер не найден' });
                }
                return res.status(200).json({ msg: 'Номер обновлен', nomer: updatedNomer });
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
                const { uuid } = req.params;
                const deletedNomer = yield Nomer_1.default.findOneAndDelete({ uuidNomer: uuid });
                if (!deletedNomer) {
                    return res.status(404).json({ error: 'Номер не найден' });
                }
                return res.status(200).json({ msg: 'Номер удален', nomer: deletedNomer });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
}
exports.default = NomerController;
