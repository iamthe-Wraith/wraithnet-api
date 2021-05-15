import { Router } from 'express';

import { v1Router } from './v1';
import { V1_ROUTE } from '../../constants';

const router = Router();

router.use(V1_ROUTE, v1Router);

export const apiRouter = router;
