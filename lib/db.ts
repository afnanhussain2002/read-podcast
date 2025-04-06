import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Check if the connection already exists in the cache
  if (cached.conn) {
    console.log("Reusing existing database connection.");
    return cached.conn;
  }

  // If no connection in cache, set up a new connection
  if (!cached.promise) {
    console.log("No existing connection, attempting to connect...");

    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => {
        console.log("Successfully connected to MongoDB!");
        return mongoose.connection;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Rethrow the error for handling in the calling code
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Database connection failed:", e);
    throw e;
  }

  console.log("Database connection established.");
  return cached.conn;
}
