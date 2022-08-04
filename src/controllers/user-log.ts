import { RequestHandler } from 'express';

import { Response } from '../utils/response';
import { IRequest } from '../types/request';
import { UserLogService } from '../services/user-log';
import { IUserLogEntries, IUserLogEntry } from '../models/user-log';

export class UserLogController {
  static create:RequestHandler = async (req:IRequest, res) => {
    try {
      const entry = await UserLogService.create(req);
      Response.send(UserLogService.getSharable(entry), req, res);
    } catch (err: any) {
      Response.error(err, req, res);
    }
  };

  static get: RequestHandler = async (req: IRequest, res) => {
    try {
      const entries = await UserLogService.get(req);
      if (Array.isArray((entries as IUserLogEntries)?.entries)) {
        const result = {
          ...entries,
          entries: (entries as IUserLogEntries).entries.map(e => UserLogService.getSharable((e as IUserLogEntry))),
        };

        Response.send(result, req, res);
      } else {
        Response.send(UserLogService.getSharable((entries as IUserLogEntry)), req, res);
      }
    } catch (err: any) {
      Response.error(err, req, res);
    }
  };

  static update: RequestHandler = async (req: IRequest, res) => {
    try {
      const entry = await UserLogService.update(req);
      Response.send(UserLogService.getSharable(entry), req, res);
    } catch (err: any) {
      Response.error(err, req, res);
    }
  };

  static delete: RequestHandler = async (req: IRequest, res) => {
    try {
      await UserLogService.delete(req);
      Response.send(null, req, res);
    } catch (err: any) {
      Response.error(err, req, res);
    }
  };
}
