import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { dbConnect } from "./config/databaseConnection.js";
import { logger } from "./config/logger.js";
import authRouter from "./routes/auth.routes.js";

dbConnect();

const app = express();

// Middlewares 
app.use(express.json());
app.use(logger);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use("/api/v1",authRouter)


app.get("/", (req, res) => {
  res.send("<h1>TripKraftr Backend is running successfully</h1>");
});

app.listen(process.env.PORT || 4000, () => {
    console.log("APP is running on this ",process.env.PORT," port")
});
