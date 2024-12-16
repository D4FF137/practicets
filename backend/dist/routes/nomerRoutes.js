"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nomerController_1 = __importDefault(require("../controllers/nomerController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const nomerRouter = (0, express_1.Router)();
nomerRouter.post('/create', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.create);
nomerRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.readAll);
nomerRouter.get('read/:uuid', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.readOne);
nomerRouter.put('/update/:uuid', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, nomerController_1.default.update);
nomerRouter.delete('/delete/:uuid', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, nomerController_1.default.delete);
exports.default = nomerRouter;
