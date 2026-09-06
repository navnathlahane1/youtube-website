import { SettingModel, ISetting } from './settings.model';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class SettingsService {
  static async getSettings(): Promise<ISetting> {
    let settings = await SettingModel.findOne({ key: 'PLATFORM_CONFIG' });
    if (!settings) {
      settings = await SettingModel.create({ key: 'PLATFORM_CONFIG' });
    }
    return settings;
  }

  static async updateSettings(data: Partial<ISetting>, actor: any) {
    let settings = await SettingModel.findOne({ key: 'PLATFORM_CONFIG' });
    if (!settings) {
      settings = new SettingModel({ key: 'PLATFORM_CONFIG' });
    }

    const oldValue = settings.toObject();
    Object.assign(settings, data);
    await settings.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE_SETTINGS',
      module: 'SETTINGS',
      oldValue,
      newValue: settings.toObject(),
    });

    return settings;
  }
}
