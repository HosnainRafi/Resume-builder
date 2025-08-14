import app from './app';
import env from './config';
import logger from './utils/logger';
import connectDB from './utils/db'; // <-- ADD THIS IMPORT

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB(); // <-- ADD THIS LINE

    // Start the Express server
    app.listen(env.PORT, () => {
      logger.info(
        `Server running on port ${env.PORT} in ${env.NODE_ENV} mode.`
      );
      logger.info(`Access Health Check at http://localhost:${env.PORT}/health`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start the server.');
    process.exit(1);
  }
};

startServer();
