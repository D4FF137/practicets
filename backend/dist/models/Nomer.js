"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const nomerSchema = new mongoose_1.default.Schema({
    uuidNomer: {
        type: String,
        default: uuid_1.v4,
        unique: true
    },
    nameNomer: {
        type: String,
        required: true,
        unique: true
    }
});
const Nomer = mongoose_1.default.model('Nomer', nomerSchema);
exports.default = Nomer;
