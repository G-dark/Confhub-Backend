import { config } from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

config();

export const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;

 const poolConfig:any = {
  host: HOST,
  user: USER,
  database: DB_NAME,
  password: PASSWORD,
  port: DB_PORT,
};

console.log("Database connection config:", poolConfig);
export const pool = new Pool(poolConfig);