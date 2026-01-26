import mongoose from "mongoose";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const DB_NAME = process.env.DB_NAME || "youtube";

const connectionDataBase = async () => {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("Connection string:", process.env.MONGODB_URI);

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log("MongoDB Connected Successfully!");
    console.log("Host:", connectionInstance.connection.host);
    console.log("Database:", connectionInstance.connection.name);

    // Test the connection with a simple query
    console.log(" Testing database connection...");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );
  } catch (error) {
    console.error("MongoDB Connection Failed!");
    console.error("Error:", error.message);
    throw error;
  }
};

connectionDataBase()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
