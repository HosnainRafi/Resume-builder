import mongoose from 'mongoose';
import env from '../config';
import logger from './logger';

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    logger.error(
      { err: error },
      'Failed to connect to MongoDB. Shutting down.'
    );
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully.');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error.');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected.');
});

export default connectDB;
