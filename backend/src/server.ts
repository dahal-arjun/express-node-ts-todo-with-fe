import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/todo_routes";
import bodyParser from "body-parser";
import sequelize from "./config/db";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TODO API",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Don't care about the port  as we will be masking it anyway :)
const PORT = 8000;

// Initialize Database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((error) => {
    // Just Kill the server but not killing it.
    console.error("Unable to connect to the database:", error);
  });

app.use("/api/todos", router);

app.listen(PORT, () => {
  console.log(`Server is running....`);
});
