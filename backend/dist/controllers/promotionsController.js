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
const Promotions_1 = __importDefault(require("../models/Promotions"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, uniqueSuffix + extension);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const promotionValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(10).max(500),
});
class PromotionsController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'Файл изображения не загружен' });
                }
                const validatedData = promotionValidationSchema.parse(req.body);
                const promotion = new Promotions_1.default({
                    title: validatedData.title,
                    description: validatedData.description,
                    image: req.file.filename,
                });
                const savedPromotion = yield promotion.save();
                return res.status(201).json({ msg: 'Промоакция создана', promotion: savedPromotion });
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
                const promotions = yield Promotions_1.default.find();
                return res.status(200).json(promotions);
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
                const promotion = yield Promotions_1.default.findById(id);
                if (!promotion) {
                    return res.status(404).json({ error: 'Промоакция не найдена' });
                }
                return res.status(200).json(promotion);
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
                const imagePath = req.file ? req.file.path : undefined;
                const validatedData = promotionValidationSchema.parse(req.body);
                const updatedPromotion = yield Promotions_1.default.findByIdAndUpdate(id, {
                    title: validatedData.title,
                    description: validatedData.description,
                    image: imagePath,
                }, { new: true });
                if (!updatedPromotion) {
                    return res.status(404).json({ error: 'Промоакция не найдена' });
                }
                return res.status(200).json({ msg: 'Промоакция обновлена', promotion: updatedPromotion });
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
                const deletedPromotion = yield Promotions_1.default.findByIdAndDelete(id);
                if (!deletedPromotion) {
                    return res.status(404).json({ error: 'Промоакция не найдена' });
                }
                return res.status(200).json({ msg: 'Промоакция удалена', promotion: deletedPromotion });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });
    }
}
exports.default = PromotionsController;
