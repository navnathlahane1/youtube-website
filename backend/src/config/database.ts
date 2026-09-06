import dns from 'dns';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';
import { logger } from './logger';

// Set public Google / Cloudflare DNS servers to resolve MongoDB Atlas SRV records on Windows networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
} catch {
  // Use default DNS if setting servers fails
}

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  let uri = env.MONGODB_URI;

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    logger.info('✅ Connected to MongoDB successfully.');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB disconnected.');
  });

  // If a MongoDB Atlas URI is provided, attempt connection
  if (uri) {
    try {
      logger.info('🔗 Connecting to MongoDB Atlas cluster...');
      return await mongoose.connect(uri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000,
      });
    } catch (error: any) {
      logger.warn(`⚠️ Failed to connect to MongoDB Atlas (${error.message}). Switching to in-memory MongoDB fallback...`);
    }
  }

  // Fallback to in-memory database for seamless local development
  logger.info('⚠️ Initializing development in-memory MongoDB server...');
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    uri = mongoMemoryServer.getUri();
    logger.info(`✨ In-memory MongoDB server running at: ${uri}`);
    return await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
  } catch (err) {
    logger.error('Failed to start in-memory MongoDB server, defaulting to local connection:', err);
    uri = 'mongodb://127.0.0.1:27017/engineering_portal';
    return await mongoose.connect(uri);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
