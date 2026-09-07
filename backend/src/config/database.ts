import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

// Set public DNS servers only for local Windows dev if needed (never on Vercel/Lambda)
if (env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
  } catch {
    // Use default system DNS
  }
}

// Global connection caching across serverless invocations
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let mongoMemoryServer: any = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  // Return cached active connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const isServerlessOrProd = env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const uri = env.MONGODB_URI;

  mongoose.set('strictQuery', true);

  // Setup connection event listeners once
  if (mongoose.connection.listenerCount('error') === 0) {
    mongoose.connection.on('connected', () => {
      logger.info('✅ Connected to MongoDB successfully.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected.');
    });
  }

  // 1. Production or real Atlas connection provided
  if (uri) {
    try {
      logger.info('🔗 Connecting to MongoDB Atlas cluster...');
      cached.promise = mongoose.connect(uri, {
        autoIndex: !isServerlessOrProd, // Disable automatic index builds in serverless to reduce latency
        serverSelectionTimeoutMS: 10000,
        bufferCommands: false,
      });

      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error: any) {
      cached.promise = null;
      if (isServerlessOrProd) {
        logger.error(`❌ Failed to connect to MongoDB in production: ${error.message}`);
        throw new Error(`MongoDB connection failed: ${error.message}. Please verify MONGODB_URI on Vercel.`);
      }
      logger.warn(`⚠️ Failed to connect to MongoDB Atlas (${error.message}). Switching to in-memory fallback for dev...`);
    }
  }

  // 2. In production or Vercel, in-memory DB is prohibited
  if (isServerlessOrProd) {
    throw new Error('MONGODB_URI environment variable is required in production/Vercel environments.');
  }

  // 3. Fallback to in-memory database ONLY for local development
  logger.info('⚠️ Initializing development in-memory MongoDB server...');
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    logger.info(`✨ In-memory MongoDB server running at: ${memUri}`);

    cached.promise = mongoose.connect(memUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    logger.error('Failed to start in-memory MongoDB server, defaulting to local connection:', err);
    const localUri = 'mongodb://127.0.0.1:27017/engineering_portal';
    cached.promise = mongoose.connect(localUri);
    cached.conn = await cached.promise;
    return cached.conn;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
}
