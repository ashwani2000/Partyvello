import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/partypops';
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (isProduction && !process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be configured in production.');
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: isProduction ? 10000 : 2500 });

    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    if (isProduction) {
      throw error;
    }

    console.warn('MongoDB not available. Starting with demo in-memory data mode.');
    console.warn(error.message);
    return false;
  }
};
