import { Router } from 'express';

import { AuthController } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.route('/')
  .post(AuthController.authenticate);

router.route('/verify-token')
  .post(authMiddleware, AuthController.verifyToken);

export const authRouter = router;
