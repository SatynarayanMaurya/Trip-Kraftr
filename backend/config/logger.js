// import morgan from "morgan";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

// const logDirectory = path.join(process.cwd(), "logs");

// // Create logs folder if not exists
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

// // Decide file name based on environment
// const logFileName =
//   process.env.NODE_ENV === "production"
//     ? "production.log"
//     : "development.log";

// // Create write stream
// const logStream = fs.createWriteStream(
//   path.join(logDirectory, logFileName),
//   { flags: "a" }
// );

// // 🟢 Custom IST timestamp token
// morgan.token("ist-date", () => {
//   return new Date().toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//   });
// });

// // Custom format using IST time
// const format = process.env.NODE_ENV === "production"
//   ? ':remote-addr - - [:ist-date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
//   : ":method :url :status :response-time ms [:ist-date]";

// export const logger = morgan(format, { stream: logStream });



import morgan from "morgan";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const logDirectory = path.join(process.cwd(), "logs");

// Create logs folder if not exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Decide file name based on environment
const logFileName =
  process.env.NODE_ENV === "production"
    ? "production.log"
    : "development.log";

// Create write stream (file logging)
const logStream = fs.createWriteStream(
  path.join(logDirectory, logFileName),
  { flags: "a" }
);

// 🟢 Custom IST timestamp token
morgan.token("ist-date", () => {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
});

// Custom format using IST time
const format =
  process.env.NODE_ENV === "production"
    ? ':remote-addr - - [:ist-date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
    : ":method :url :status :response-time ms [:ist-date]";

// ⭐ STREAM WRITER → writes to BOTH console + file
const stream = {
  write: (message) => {
    process.stdout.write(message); // shows in Render logs
    logStream.write(message);      // saves in file
  },
};

// Export logger middleware
export const logger = morgan(format, { stream });