import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';

async function startServer() {
  try {
    logger.info('🚀 Starting Engineering Platform Backend API Server...');
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`🌐 API Server listening on http://localhost:${env.PORT}`);
      logger.info(`📚 Swagger/REST API v1 endpoints accessible at http://localhost:${env.PORT}/api/v1`);
      logger.info(`✨ Admin origin: ${env.ADMIN_URL} | Client origin: ${env.CLIENT_URL}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`⚠️ Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('💤 HTTP Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
