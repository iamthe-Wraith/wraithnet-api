import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user';

export interface IRequest extends Request {
    requestor?: IUser;
}

export interface IPostRequest<T> extends IRequest {
    body: T;
}

export type IRequestHandler = (req: IRequest, res: Response, next: NextFunction) => void
