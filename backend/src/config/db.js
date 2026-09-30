import mongoose from "mongoose"

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI?.trim() || "mongodb://127.0.0.1:27017/realstate";

  try {
    const options = {
      serverSelectionTimeoutMS: 3000,
    };
    const databaseName = process.env.MONGODB_DB_NAME?.trim();
    if (databaseName) options.dbName = databaseName;

    await mongoose.connect(mongoUri, options);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error?.message || error);
    console.warn("Continuing without MongoDB. Start your MongoDB instance or provide a reachable MONGODB_URI.");
  }
};

export { connectDB }