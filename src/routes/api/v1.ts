import { Router } from 'express';

import { authMiddleware } from '../../middleware/auth'; 
import { UsersController } from '../../controllers/users';
import { AUTHORIZATION_HEADER, DND_ROUTE, ERROR, NOTES_ROUTE, PROFILE_ROUTE, TAGS_ROUTE, TEST_ROUTE, USERS_ROUTE, USER_LOG_ROUTE } from '../../constants';
import CustomError from '../../utils/custom-error';
import { Response } from '../../utils/response';
import { UserLogController } from '../../controllers/user-log';
import { TagsController } from '../../controllers/tags';
import { TestController } from '../../controllers/test';
import { DnDController } from '../../controllers/dnd';
import { NotesController } from '../../controllers/notes';
import { NotesService } from '../../services/notes';

const router = Router();

/*****************************************************
 **                      Users                      **
 *****************************************************/
router.route(USERS_ROUTE)
    .post((req, res, next) => {
        const token = req.get(AUTHORIZATION_HEADER);

        if (typeof token !== 'undefined') {
            // is request of existing user to create a new user
            // need to authenticate them first...
            authMiddleware(req, res, next);
        } else {
            // is request by new user to create account...this is not supported currently.
            // next();

            Response.error(new CustomError('You are not authorized to make this request.', ERROR.UNAUTHORIZED), req, res);
        }
    }, UsersController.create)
    .get(authMiddleware, UsersController.get);

router.route(`${USERS_ROUTE}/:username`)
    .get(authMiddleware, UsersController.get)
    .patch(authMiddleware, UsersController.update)
    .delete(authMiddleware, UsersController.delete);

router.route(`${USERS_ROUTE}/change-password`)
    .post(authMiddleware, UsersController.changePassword);

router.route(USER_LOG_ROUTE)
    .post(authMiddleware, UserLogController.create)
    .get(authMiddleware, UserLogController.get);

router.route(`${USER_LOG_ROUTE}/:id`)
    .get(authMiddleware, UserLogController.get)
    .patch(authMiddleware, UserLogController.update)
    .delete(authMiddleware, UserLogController.delete);

router.route(PROFILE_ROUTE)
    .get(authMiddleware, UsersController.getProfile);

/*****************************************************
 **                      Tags                       **
 *****************************************************/
router.route(TAGS_ROUTE)
    .post(authMiddleware, TagsController.create)
    .get(authMiddleware, TagsController.get);

router.route(`${TAGS_ROUTE}/:id`)
    .get(authMiddleware, TagsController.get)
    .delete(authMiddleware, TagsController.delete)
    .patch(authMiddleware, TagsController.update);

router.route(`${TEST_ROUTE}/get-server-time`)
    .get(authMiddleware, TestController.getServerTime);

/*****************************************************
 **                      Notes                      **
 *****************************************************/
router.route(NOTES_ROUTE)
    .post(authMiddleware, NotesController.createNote)
    .get(authMiddleware, NotesController.getNotes);

router.route(`${NOTES_ROUTE}/s/:slug`)
    .get(authMiddleware, NotesController.getNoteBySlug);

router.route(`${NOTES_ROUTE}/:id`)
    .get(authMiddleware, NotesController.getNoteById)
    .patch(authMiddleware, NotesController.updateNote)
    .delete(authMiddleware, NotesController.deleteNote);

/*****************************************************
 **                      D&D                        **
 *****************************************************/
router.route(`${DND_ROUTE}/static/race`)
    .get(authMiddleware, DnDController.getRaces);

router.route(`${DND_ROUTE}/static/class`)
    .get(authMiddleware, DnDController.getClasses);

router.route(`${DND_ROUTE}/static/levels`)
    .get(authMiddleware, DnDController.getLevels);

router.route(`${DND_ROUTE}${NOTES_ROUTE}/misc`)
    .get(authMiddleware, DnDController.getMiscNotes);

router.route(`${DND_ROUTE}${NOTES_ROUTE}/misc/:id`)
    .get(authMiddleware, DnDController.getMiscNote);

router.route(`${DND_ROUTE}/:campaignId?`)
    .get(authMiddleware, DnDController.getCampaigns)
    .post(authMiddleware, DnDController.createCampaign)
    .patch(authMiddleware, DnDController.updateCampaign)
    .delete(authMiddleware, DnDController.deleteCampaign);

router.route(`${DND_ROUTE}/:campaignId/daily-checklist/:id?`)
    .get(authMiddleware, DnDController.getChecklist)
    .post(authMiddleware, DnDController.addChecklistItem)
    .patch(authMiddleware, DnDController.updateChecklistItem)
    .delete(authMiddleware, DnDController.deleteChecklistItem);

router.route(`${DND_ROUTE}/:campaignId/party-exp`)
    .patch(authMiddleware, DnDController.updatePartyXP);

router.route(`${DND_ROUTE}/:campaignId/pc`)
    .post(authMiddleware, DnDController.createPC)
    .get(authMiddleware, DnDController.getPCs);

router.route(`${DND_ROUTE}/:campaignId/pc/:id/exp`)
    .patch(authMiddleware, DnDController.updatePCExp)

router.route(`${DND_ROUTE}/:campaignId/pc/:id`)
    .get(authMiddleware, DnDController.getPC)
    .patch(authMiddleware, DnDController.updatePC)
    .delete(authMiddleware, DnDController.deletePC);

export const v1Router = router;
