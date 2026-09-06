import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { sendSuccess } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class SettingsController {
  static async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getSettings();
      return sendSuccess(res, settings);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await SettingsService.updateSettings(req.body, req.admin);
      return sendSuccess(res, updated, 'Settings updated successfully');
    } catch (error) {
      return next(error);
    }
  }
}
