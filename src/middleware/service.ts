import { RequestHandler } from 'express';

import CustomError from '../utils/custom-error';
import { Response } from '../utils/response';
import {
  SERVICES_HEADER,
  SERVICES
} from '../constants';

export const serviceMiddleware:RequestHandler = (req, res, next) => {
  const serviceName = req.get(SERVICES_HEADER);

  if (serviceName && SERVICES.has(serviceName)) {
    next();
  } else {
    const error = new CustomError('invalid service');
    Response.error(error, req, res);
  }
};
