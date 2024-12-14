import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { DB } from "./env"

configDotenv();

export default async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(DB);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
}