import { Router } from 'express';
import { USERS_ROUTE } from '../../constants';
import { UsersController } from '../../controllers/users';
import { authMiddleware } from '../../middleware/auth';
import { minRoleRequiredMiddleware } from '../../middleware/permissions-required';
import { ROLE } from '../../models/user';

const router = Router();

router.route(USERS_ROUTE)
    .get(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), UsersController.get);

export const adminRouter = router;
