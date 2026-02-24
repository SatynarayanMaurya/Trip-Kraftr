import mongoose from "mongoose"

export const dbConnect = async () => {
  try {
    if (!process.env.MONGO_DB_URL) {
      throw new Error("MONGO_DB_URL is not defined in environment variables")
    }

    await mongoose.connect(process.env.MONGO_DB_URL)

    console.log("✅ Database connection successful")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}