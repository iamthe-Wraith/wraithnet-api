import { Router } from 'express';

import { authMiddleware } from '../../middleware/auth'; 
import { UsersController } from '../../controllers/users';
import { AUTHORIZATION_HEADER, ERROR, USERS_ROUTE } from '../../constants';
import CustomError from '../../utils/custom-error';
import { Response } from '../../utils/response';

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


export const v1Router = router;
