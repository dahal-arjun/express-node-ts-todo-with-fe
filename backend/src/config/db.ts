import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST || "localhost";
const port = Number(process.env.MYSQL_CUSTOM_PORT) || 3306;

if (!database || !username || !password) {
  throw new Error("Missing required environment variables");
}

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: "mysql",
});

export default sequelize;
