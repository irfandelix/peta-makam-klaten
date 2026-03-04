import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return; // Kalau sudah nyambung, biarkan
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Berhasil nyambung ke MongoDB!");
  } catch (error) {
    console.log("Gagal nyambung ke MongoDB: ", error);
  }
};