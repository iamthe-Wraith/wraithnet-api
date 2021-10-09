import { Router } from 'express';

import { authMiddleware } from '../../middleware/auth'; 
import { UsersController } from '../../controllers/users';
import { AUTHORIZATION_HEADER, DND_ROUTE, ERROR, PROFILE_ROUTE, TAGS_ROUTE, TEST_ROUTE, USERS_ROUTE, USER_LOG_ROUTE } from '../../constants';
import CustomError from '../../utils/custom-error';
import { Response } from '../../utils/response';
import { UserLogController } from '../../controllers/user-log';
import { TagsController } from '../../controllers/tags';
import { TestController } from '../../controllers/test';
import { DnDController } from '../../controllers/dnd';

const router = Router();

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
 **                      D&D                        **
 *****************************************************/
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

export const v1Router = router;
