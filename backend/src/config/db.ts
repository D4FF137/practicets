import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { DB } from "./env"

// Загружаем переменные окружения
configDotenv();

// Функция для подключения к базе данных
export default async function connectDB(): Promise<void> {
    try {
        // Проверяем, что переменная окружения DB определена
        if (!DB) {
            throw new Error("Environment variable DB is not defined");
        }

        // Подключаемся к базе данных
        await mongoose.connect(DB);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
}