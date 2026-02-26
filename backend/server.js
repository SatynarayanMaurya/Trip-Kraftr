import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/databaseConnection.js";
import { logger } from "./config/logger.js";
import authRouter from "./routes/auth.routes.js";
import planRouter from "./routes/plan.routes.js";



const app = express();

// Middlewares 
app.use(express.json());
app.use(logger);
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use("/api/v1",authRouter)
app.use("/api/v1",planRouter)


app.get("/", (req, res) => {
  res.send("<h1>TripKraftr Backend is running successfully</h1>");
});

dbConnect().then(()=>{
  app.listen(process.env.PORT || 4000, () => {
      console.log("APP is running on this ",process.env.PORT," port")
  });
}).catch((error)=>{
  console.log("Error in connection of db : ",error)
})
