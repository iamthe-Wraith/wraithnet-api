import express, { RequestHandler } from 'express';

import CustomError from '../utils/custom-error';
import { Response } from '../utils/response';
import Token from '../utils/token';
import { UsersService } from '../services/user';
import { AUTHORIZATION_HEADER, TOKEN_REMOVE } from '../constants';
import { IRequest } from '../types/request';

export const authMiddleware:RequestHandler = async (req:IRequest, res, next) => {
    const token = req.get(AUTHORIZATION_HEADER);

    if (token !== undefined) {
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
                error = new CustomError(err.message);
            }

            Response.error(error, req, res, TOKEN_REMOVE);
        }
    } else {
        Response.error(new CustomError('no authentication token found'), req, res);
    }
};
