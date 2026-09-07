import { app } from '../src/app';
import { connectDatabase } from '../src/config/database';

export default async function handler(req: any, res: any) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless Handler Database Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error connecting to database. Please verify MONGODB_URI.',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
}
