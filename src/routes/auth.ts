import { Router } from 'express';

import { AuthController } from '../controllers/auth';

const router = Router();

router.route('/')
  .post(AuthController.authenticate);

export const authRouter = router;
