"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRouter = (0, express_1.Router)();
userRouter.post('/create', userController_1.default.create);
userRouter.post('/login', userController_1.default.login);
userRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, userController_1.default.readAll);
userRouter.get('/read/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, userController_1.default.readOne);
userRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, userController_1.default.update);
userRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, userController_1.default.delete);
exports.default = userRouter;
