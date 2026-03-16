import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoDB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/perplexity';

    await mongoose.connect(mongoDB_URI)

    console.log('Database connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
