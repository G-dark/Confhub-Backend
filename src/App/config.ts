import { config } from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

config();

export const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
export const JWT_SECRET_KEY= process.env.JWT_SECRET_KEY;
export const PEPPER= process.env.PEPPER || "loquesea";
export const SALT_OR_ROUNDS= Number(process.env.SALT_OR_ROUNDS) || 10;
const base = (HOST == "localhost") ? ("http://") : ("https://");
export const URL_BASE = base + HOST + ":" + PORT + "/"
 const poolConfig:any = {
  host: DB_HOST,
  user: USER,
  database: DB_NAME,
  password: PASSWORD,
  port: DB_PORT,
};

console.log("Database connection ✅ " );
export const pool = new Pool(poolConfig);
