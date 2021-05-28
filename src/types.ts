import { Document, Mongoose } from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';

export interface IBaseResource {
  createdAt?: Date;
  lastModified?: Date;
}

export abstract class IController {
  abstract create?(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ):void;
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

export interface IUser extends IBaseResource, Document {
  username: string;
  email: string;
  password: string;
  permissions: PERMISSION;
  statuses: IUserStatuses; 
}

export interface IUserGetResponse {
  users: IUser[];
  count?: number;
}

export interface IUserQuery {
  username?: string | IRegexQuery;
  email?: IRegexQuery;
  'statuses.banned'?: { $in: boolean[] };
  'statuses.markedForDeletion'?: { $in: boolean[] };
  'statuses.modified'?: { $in: boolean[] };
  'statuses.online'?: { $in: boolean[] };
  'statuses.verified'?: { $in: boolean[] };
}

export interface IUserSharable extends IBaseResource {
  _id: string;
  username: string;
  email: string;
  permissions: string;
  statuses: IUserStatuses;
}

export interface IUserStatuses {
  verified: boolean;
  banned?: boolean;
  markedForDeletion?: boolean;
}

export enum PERMISSION { GOD = 0, ADMIN, MEMBER };

export interface IFilter {
  [key: string]: any;
}

export interface IUserLogEntry extends IBaseResource {
  owner: IUser['id'];
  content: string;
  tags?: string[];
}