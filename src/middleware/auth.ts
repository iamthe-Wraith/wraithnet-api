import express from 'express';

import CustomError from '../utils/custom-error';
import { Response } from '../utils/response';
import Token from '../utils/token';
import { UsersService } from '../services/user';
import { AUTHORIZATION_HEADER, ERROR, TOKEN_REMOVE } from '../constants';
import { IRequest } from '../types/request';

export const authMiddleware = async (req: IRequest, res, next) => {
  const token = req.get(AUTHORIZATION_HEADER);

  if (!token) Response.error(new CustomError('no authentication token found'), req, res);

  try {
    const payload = await Token.verify(token);
    const request = <express.Request>{
      query: {},
      params: {},
    };
    request.params.username = payload.username;

    const results = await UsersService.get(request);

    const [u] = results.users;
    req.requestor = u;

    next();
  } catch (err: any) {
    let error:CustomError;

    if (err.isCustomError) {
      error = err;
    } else {
      error = new CustomError(err.message, ERROR.UNAUTHORIZED);
    }

    Response.error(error, req, res, TOKEN_REMOVE);
  }
};
