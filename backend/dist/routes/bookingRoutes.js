"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = __importDefault(require("../controllers/bookingController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const bookingRouter = (0, express_1.Router)();
bookingRouter.post('/create', authMiddleware_1.authMiddleware, bookingController_1.default.create);
bookingRouter.get('/readall', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.readAll);
bookingRouter.get('/read/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.readOne);
bookingRouter.put('/update/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.update);
bookingRouter.delete('/delete/:id', authMiddleware_1.authMiddleware, authMiddleware_1.hostesMiddleware, bookingController_1.default.delete);
exports.default = bookingRouter;
