"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promotionsController_1 = __importDefault(require("../controllers/promotionsController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const promotionsRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
promotionsRouter.post('/create', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, upload.single('image'), promotionsController_1.default.create);
promotionsRouter.get('/readall', promotionsController_1.default.readAll);
promotionsRouter.get('/read/:id', promotionsController_1.default.readOne);
promotionsRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, upload.single('image'), promotionsController_1.default.update);
promotionsRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, promotionsController_1.default.delete);
exports.default = promotionsRouter;
