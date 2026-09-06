import { Readable } from 'stream';
import { cloudinary } from '../../config/cloudinary';
import { env } from '../../config/env';
import { MediaModel, IMedia } from './media.model';
import { BadRequestError, NotFoundError } from '../../common/errors';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class MediaService {
  static getSignedUploadConfig(folder = 'engineering_portal') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);

    return {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
    };
  }

  static async uploadFile(file: Express.Multer.File, folder = 'engineering_portal', actor: any): Promise<IMedia> {
    if (!file) {
      throw new BadRequestError('No file provided for upload');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        async (error, result) => {
          if (error || !result) {
            return reject(new BadRequestError(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`));
          }

          try {
            const registered = await MediaModel.create({
              publicId: result.public_id,
              url: result.url,
              secureUrl: result.secure_url,
              format: result.format || file.mimetype.split('/')[1] || 'pdf',
              resourceType: result.resource_type || 'raw',
              bytes: result.bytes || file.size,
              originalFilename: file.originalname,
              width: result.width,
              height: result.height,
              folder,
              uploadedBy: actor?.id,
            });

            if (actor) {
              await AuditLogService.record({
                actorId: actor.id,
                actorEmail: actor.email,
                actorRole: actor.role,
                action: 'UPLOAD_MEDIA',
                module: 'MEDIA',
                entityId: registered._id.toString(),
                newValue: { publicId: result.public_id, secureUrl: result.secure_url, filename: file.originalname },
              });
            }

            resolve(registered);
          } catch (dbError) {
            reject(dbError);
          }
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  static async registerAsset(data: Partial<IMedia>, actor: any) {
    if (!data.publicId || (!data.secureUrl && !data.url)) {
      throw new BadRequestError('publicId and url are required');
    }

    const created = await MediaModel.create({
      ...data,
      secureUrl: data.secureUrl || data.url,
      uploadedBy: actor?.id,
    });

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPLOAD_MEDIA',
        module: 'MEDIA',
        entityId: created._id.toString(),
        newValue: { publicId: data.publicId, format: data.format, url: created.secureUrl },
      });
    }

    return created;
  }

  static async listAssets(page = 1, limit = 24, format?: string) {
    const filter: any = {};
    if (format) filter.format = format;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      MediaModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MediaModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async deleteAsset(id: string, actor: any) {
    const item = await MediaModel.findById(id);
    if (!item) throw new NotFoundError('Media not found');

    // Attempt Cloudinary deletion
    try {
      await cloudinary.uploader.destroy(item.publicId, { resource_type: item.resourceType as any });
    } catch {
      // Continue even if remote already deleted
    }

    await MediaModel.findByIdAndDelete(id);

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE_MEDIA',
        module: 'MEDIA',
        entityId: id,
      });
    }
  }
}
