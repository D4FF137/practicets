"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const roleRoutes_1 = __importDefault(require("./roleRoutes"));
const nomerRoutes_1 = __importDefault(require("./nomerRoutes"));
const promotionsRoutes_1 = __importDefault(require("./promotionsRoutes"));
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const router = (0, express_1.Router)();
router.use('/user', userRoutes_1.default);
router.use('/role', roleRoutes_1.default);
router.use('/nomer', nomerRoutes_1.default);
router.use('/promotions', promotionsRoutes_1.default);
router.use('/booking', bookingRoutes_1.default);
exports.default = router;
