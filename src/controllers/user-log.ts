import { RequestHandler } from 'express';

import { Response } from '../utils/response';
import { IRequest } from '../types';
import { UserLogService } from '../services/user-log';

export class UserLogController {
  static create:RequestHandler = async (req:IRequest, res) => {
    try {
      const entry = await UserLogService.create(req);
      Response.send(entry, req, res);
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static get: RequestHandler = async (req: IRequest, res) => {
    try {
      const entries = await UserLogService.get(req);
      Response.send(entries, req, res);
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static update: RequestHandler = async (req: IRequest, res) => {
    try {
      const entry = await UserLogService.update(req);
      Response.send(entry, req, res);
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static delete: RequestHandler = async (req: IRequest, res) => {
    try {
      await UserLogService.delete(req);
      Response.send(null, req, res);
    } catch (err) {
      Response.error(err, req, res);
    }
  }
}
