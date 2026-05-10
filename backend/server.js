

// server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnect } from "./config/databaseConnection.js";
import { connectCloudinary } from "./config/cloudinaryConnection.js";
import { logger } from "./config/logger.js";
import authRouter from "./routes/auth.routes.js";
import planRouter from "./routes/plan.routes.js";
import organizationRouter from "./routes/organization.routes.js";
import userRouter from "./routes/userRoutes.js";
import regionRouter from "./routes/region.route.js";
import subRegionRouter from "./routes/subRegion.routes.js";
import vehicleRouter from "./routes/vehicle.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import roomRateRouter from "./routes/roomRate.routes.js";
import placeRouter from "./routes/place.routes.js";
import activityRouter from "./routes/activity.routes.js";
import policyRouter from "./routes/policy.routes.js";
import groupTripRouter from "./routes/groupTrip.routes.js";
import accountsRouter from "./routes/accounts.routes.js";
import enquiryRouter from "./routes/enquiry.routes.js";

// Step 1: Initialize critical services (DB + Cloudinary)
const initializeServices = async () => {
  try {
    await dbConnect();         
    await connectCloudinary(); 
  } catch (error) {
    console.error("❌ Critical service initialization failed:", error.message);
    process.exit(1); 
  }
};

initializeServices().then(() => {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(logger);
  app.use(cookieParser());
  app.use(fileUpload());
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    // origin: process.env.FRONTEND_URL_PREVIEW,
    credentials: true
  }));

  // Routes
  app.use("/api/v1", authRouter);
  app.use("/api/v1", planRouter);
  app.use("/api/v1", organizationRouter);
  app.use("/api/v1", userRouter);
  app.use("/api/v1", regionRouter);
  app.use("/api/v1", subRegionRouter);
  app.use("/api/v1", vehicleRouter);
  app.use("/api/v1", hotelRouter);
  app.use("/api/v1", roomRouter);
  app.use("/api/v1", roomRateRouter);
  app.use("/api/v1", placeRouter);
  app.use("/api/v1", activityRouter);
  app.use("/api/v1", policyRouter);
  app.use("/api/v1", groupTripRouter);
  app.use("/api/v1", accountsRouter);
  app.use("/api/v1", enquiryRouter);

  app.get("/", (req, res) => {
    res.send("<h1>TripKraftr Backend is running successfully</h1>");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`APP is running on port ${PORT}`);
  });
});


















// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { dbConnect } from "./config/databaseConnection.js";
// import { connectCloudinary } from "./config/cloudinaryConnection.js";
// import { logger } from "./config/logger.js";
// import authRouter from "./routes/auth.routes.js";
// import planRouter from "./routes/plan.routes.js";

// connectCloudinary()

// const app = express();

// // Middlewares 
// app.use(express.json());
// app.use(logger);
// app.use(cookieParser())
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));

// // Routes
// app.use("/api/v1",authRouter)
// app.use("/api/v1",planRouter)



// app.get("/", (req, res) => {
//   res.send("<h1>TripKraftr Backend is running successfully</h1>");
// });

// dbConnect().then(()=>{
//   app.listen(process.env.PORT || 4000, () => {
//       console.log("APP is running on this ",process.env.PORT," port")
//   });
// }).catch((error)=>{
//   console.log("Error in connection of db : ",error)
// })
