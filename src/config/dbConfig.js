import mongoose from "mongoose";

export async function connectDB(params) {
    const uri=process.env.MONGO_URI || "mongodb://127.0.0.1:27017/class-zero";
    await mongoose.connect(uri);
    console.log("Mongo conectado",mongoose.connection.name)
    
}