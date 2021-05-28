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
}
