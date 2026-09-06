import { PlaylistModel, IPlaylist } from './playlists.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class PlaylistsService {
  static async listPublic(filters: { branchId?: string; semesterId?: string; subjectId?: string; search?: string }, page = 1, limit = 12) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };
    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      PlaylistModel.find(filter)
        .populate('branchId', 'name code')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code')
        .populate('videoIds', 'title durationSeconds youtubeId thumbnailUrl instructorName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PlaylistModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      PlaylistModel.find()
        .populate('branchId', 'name code')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PlaylistModel.countDocuments(),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string) {
    const playlist = await PlaylistModel.findOne({ slug: slug.toLowerCase() })
      .populate('branchId')
      .populate('semesterId')
      .populate('subjectId')
      .populate('videoIds');

    if (!playlist) throw new NotFoundError('Playlist not found');
    playlist.viewCount += 1;
    await playlist.save();
    return playlist.toObject();
  }

  static async create(data: Partial<IPlaylist>, actor: any) {
    let slug = slugify(data.title || 'playlist');
    const count = await PlaylistModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const created = await PlaylistModel.create({
      ...data,
      slug,
      totalVideos: data.videoIds?.length || 0,
      status: data.status || PUBLISHING_STATUS.DRAFT,
      createdBy: actor.id,
      updatedBy: actor.id,
    });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'CREATE',
      module: 'PLAYLIST',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IPlaylist>, actor: any) {
    const playlist = await PlaylistModel.findById(id);
    if (!playlist) throw new NotFoundError('Playlist not found');

    const oldValue = playlist.toObject();
    if (data.videoIds) data.totalVideos = data.videoIds.length;
    data.updatedBy = actor.id;

    Object.assign(playlist, data);
    await playlist.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'PLAYLIST',
      entityId: id,
      oldValue,
      newValue: playlist.toObject(),
    });

    return playlist;
  }

  static async delete(id: string, actor: any) {
    const deleted = await PlaylistModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Playlist not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'PLAYLIST',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
