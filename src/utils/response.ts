import express from 'express';

import CustomError from './custom-error';
import Token from './token';
import { AUTHORIZATION_HEADER, TOKEN_REMOVE } from '../constants';
import { IRequest } from '../types/request';

const setAuthHeader = (
    req: IRequest,
    res: express.Response,
    tkn?: string,
):void => {
    let token = tkn || req.get(AUTHORIZATION_HEADER);

    if (token === TOKEN_REMOVE) {
        res.removeHeader(AUTHORIZATION_HEADER);
    } else if (token) {
        try {
            const payload = Token.getPayload(token);

            if (payload.exp && req.requestor && Token.shouldBeRefreshed(payload.exp)) {
                token = Token.generate(Token.generatePayload(req.requestor));
            }

            res.header(AUTHORIZATION_HEADER, token);
        } catch (err: any) {
            let error:CustomError;

            if (err.isCustom) {
                error = err;
            } else {
                error = new CustomError(err.message);
            }

            throw error;
        }
    }
};

export class Response {
    static error(
        error:CustomError,
        req:express.Request,
        res:express.Response,
        tkn?:string,
    ) {
        setAuthHeader(req, res, tkn);
        res.status(error.data.code).json({
            name: error.data.name,
            message: error.message,
        });
    }

    static send(
        data:any,
        req:express.Request,
        res:express.Response,
        tkn?:string,
    ) {
        setAuthHeader(req, res, tkn);

        if (data) {
            res.json(data);
        } else {
            res.end();
        }
    }
}
