import { Router } from 'express';
import { DND_ROUTE, NOTES_ROUTE, USERS_ROUTE } from '../../constants';
import { DnDController } from '../../controllers/dnd';
import { NotesController } from '../../controllers/notes';
import { UsersController } from '../../controllers/users';
import { authMiddleware } from '../../middleware/auth';
import { minRoleRequiredMiddleware } from '../../middleware/permissions-required';
import { ROLE } from '../../models/user';

const router = Router();

router.route(USERS_ROUTE)
    .get(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), UsersController.get);

/*****************************************************
 **                      D&D                        **
 *****************************************************/
router.route(`${DND_ROUTE}/race`)
    .post(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.createRace);

router.route(`${DND_ROUTE}/race/:raceId`)
    .patch(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.updateRace)
    .delete(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.deleteRace);
    
router.route(`${DND_ROUTE}/class`)
    .post(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.createClass);

router.route(`${DND_ROUTE}/class/:classId`)
    .patch(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.updateClass)
    .delete(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.deleteClass);

router.route(`${DND_ROUTE}${NOTES_ROUTE}/misc`)
    .post(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.createMiscNote);

router.route(`${DND_ROUTE}${NOTES_ROUTE}/misc/:id`)
    .patch(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.updateMiscNote)
    .delete(authMiddleware, minRoleRequiredMiddleware(ROLE.ADMIN), DnDController.deleteMiscNote);

export const adminRouter = router;
