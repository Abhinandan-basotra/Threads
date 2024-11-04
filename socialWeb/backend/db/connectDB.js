import mongoose from "mongoose";

// Connection options for better performance and control
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Limits the number of connections in the pool
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no MongoDB server is found
};

const connectDB = async () => {
  try {
    // Attempt to connect with MongoDB using the provided URI and options
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB connected");
  } catch (error) {
    // Log the error and possibly re-throw to handle it in a higher scope
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export default connectDB;
