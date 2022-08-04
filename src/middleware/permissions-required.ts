import { RequestHandler } from 'express';

import CustomError from '../utils/custom-error';
import { Response } from '../utils/response';
import { ROLE } from '../models/user';
import { IRequest } from '../types/request';
import { ERROR } from '../constants';

export const minRoleRequiredMiddleware = (minRequiredRole: ROLE): RequestHandler => (req: IRequest, res, next) => {
  if (req.requestor.role <= minRequiredRole) {
    next();
  } else {
    const error = new CustomError('You\'re not authorized to make this request.', ERROR.UNAUTHORIZED);
    Response.error(error, req, res);
  }
};
