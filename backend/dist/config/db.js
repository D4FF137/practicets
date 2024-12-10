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
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const env_1 = require("./env");
// Загружаем переменные окружения
(0, dotenv_1.configDotenv)();
// Функция для подключения к базе данных
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Проверяем, что переменная окружения DB определена
            if (!env_1.DB) {
                throw new Error("Environment variable DB is not defined");
            }
            // Подключаемся к базе данных
            yield mongoose_1.default.connect(env_1.DB);
            console.log("Connected to DB");
        }
        catch (error) {
            console.error("Error connecting to DB:", error);
        }
    });
}