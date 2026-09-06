import { Response, NextFunction } from 'express';
import { MediaService } from './media.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';
import { BadRequestError } from '../../common/errors';

export class MediaController {
  static async getUploadSignature(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const folder = (req.body?.folder as string) || (req.query?.folder as string) || 'engineering_portal';
      const config = MediaService.getSignedUploadConfig(folder);
      return sendSuccess(res, config);
    } catch (error) {
      return next(error);
    }
  }

  static async uploadDirect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new BadRequestError('Please provide a file to upload');
      }
      const folder = (req.body?.folder as string) || 'engineering_portal';
      const uploaded = await MediaService.uploadFile(req.file, folder, req.admin);
      return sendCreated(res, uploaded, 'File successfully uploaded to Cloudinary');
    } catch (error) {
      return next(error);
    }
  }

  static async registerAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const registered = await MediaService.registerAsset(req.body, req.admin);
      return sendCreated(res, registered, 'Media registered successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async listAssets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 24;
      const format = req.query.format as string | undefined;

      const result = await MediaService.listAssets(page, limit, format);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await MediaService.deleteAsset(req.params.id, req.admin);
      return sendSuccess(res, null, 'Media asset deleted');
    } catch (error) {
      return next(error);
    }
  }
}
