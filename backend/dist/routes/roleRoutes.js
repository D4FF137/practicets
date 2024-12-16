"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = __importDefault(require("../controllers/roleController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleRouter = (0, express_1.Router)();
roleRouter.post('/create', roleController_1.default.create);
roleRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.readAll);
roleRouter.get('/read/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.readOne);
roleRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.update);
roleRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, roleController_1.default.delete);
exports.default = roleRouter;
