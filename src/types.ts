import { Request, Response, NextFunction } from 'express';
import { IUser } from './models/user';

export interface IBaseResource {
    createdAt?: Date;
    lastModified?: Date;
}

export interface ICollectionResponse<T> {
    count: number;
    results: T[];
}

export interface ICustomErrorBody {
    name: string;
    code: number;
};

export interface ICustomError {
    AUTHENTICATION: ICustomErrorBody
    CONFLICT: ICustomErrorBody;
    GEN: ICustomErrorBody;
    FORBIDDEN: ICustomErrorBody;
    INVALID_ARG: ICustomErrorBody;
    NOT_ALLOWED: ICustomErrorBody;
    NOT_FOUND: ICustomErrorBody;
    SERVER: ICustomErrorBody;
    SERVICE: ICustomErrorBody;
    TOKEN: ICustomErrorBody;
    UNAUTHORIZED: ICustomErrorBody;
    UNPROCESSABLE: ICustomErrorBody;
}

export interface IDateRange {
    start: Date;
    end: Date;
}

export interface IRegexQuery {
    $regex: RegExp | string;
}

export interface IRequest extends Request {
    requestor?: IUser;
}

export interface IPostRequest<T> extends IRequest {
    body: T;
}

export type IRequestHandler = (req: IRequest, res: Response, next: NextFunction) => void

export interface ITokenPayload {
    username:string;
    exp?:number;
}

export interface IUserGetResponse {
    users: IUser[];
    count?: number;
}

export interface IFilter {
    [key: string]: any;
}