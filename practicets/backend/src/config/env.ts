import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 3000;
export const DB = process.env.DB || "";
export const SECRET = process.env.SECRET || "";