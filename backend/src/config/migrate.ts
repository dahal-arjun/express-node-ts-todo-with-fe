import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import dotenv from "dotenv";
import sequelize from "./db";

dotenv.config();

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await umzugInstance.up();
    console.log("Migrations executed successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    await sequelize.close(); // Close the database connection
  }
}

// Run the migrations
runMigrations();
