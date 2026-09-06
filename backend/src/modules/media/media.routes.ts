import { Router } from 'express';
import multer from 'multer';
import { MediaController } from './media.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

const router = Router();

// 1. Direct server-side upload to Cloudinary (Multipart Form Data)
router.post('/upload', authMiddleware, upload.single('file'), MediaController.uploadDirect);

// 2. Client-side signed upload signatures (both GET and POST supported)
router.get('/signature', authMiddleware, MediaController.getUploadSignature);
router.post('/upload-signature', authMiddleware, MediaController.getUploadSignature);

// 3. Register client-uploaded asset
router.post('/register', authMiddleware, MediaController.registerAsset);

// 4. Asset catalog list and delete
router.get('/', authMiddleware, MediaController.listAssets);
router.get('/assets', authMiddleware, MediaController.listAssets);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), MediaController.deleteAsset);
router.delete('/assets/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), MediaController.deleteAsset);

export const mediaRoutes = router;
