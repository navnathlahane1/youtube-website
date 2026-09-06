import { Request, Response, NextFunction } from 'express';
import { PlaylistsService } from './playlists.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class PlaylistsController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const { branchId, semesterId, subjectId, search } = req.query as any;

      const result = await PlaylistsService.listPublic({ branchId, semesterId, subjectId, search }, page, limit);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await PlaylistsService.listAdmin(page, limit);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await PlaylistsService.getBySlug(req.params.slug);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await PlaylistsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Playlist created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PlaylistsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Playlist updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await PlaylistsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Playlist deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
