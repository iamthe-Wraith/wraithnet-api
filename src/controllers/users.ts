import { RequestHandler } from 'express';

import { Response } from '../utils/response';
import Token from '../utils/token';
import { UsersService } from '../services/user';
import { TOKEN_REMOVE } from '../constants';
import { IRequest } from '../types';

export class UsersController {
  static create:RequestHandler = async (req:IRequest, res) => {
    try {
      const user = await UsersService.create(req);

      if (!req.requestor) {
        Response.send({ user: UsersService.getSharable(user) }, req, res, Token.generate(Token.generatePayload(user)));
      } else {
        Response.send({ user: UsersService.getSharable(user, req.requestor) }, req, res);
      }
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static delete:RequestHandler = async (req:IRequest, res) => {
    try {
      const result = await UsersService.delete(req);

      if (result === 'self') {
        Response.send(null, req, res, TOKEN_REMOVE);
      } else {
        Response.send(null, req, res);
      }
    } catch (err) {
      Response.error(err, req, res);
    }
  };

  static get:RequestHandler = async (req:IRequest, res) => {
    try {
      const results = await UsersService.get(req);
      const { username } = req.params;

      if (username) {
        Response.send({ user: UsersService.getSharable(results.users[0], req.requestor) }, req, res);
      } else {
        Response.send({
          count: results.count,
          users: results.users.map(user => UsersService.getSharable(user, req.requestor))
        }, req, res);
      }
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static update:RequestHandler = async (req:IRequest, res) => {
    try {
      const results = await UsersService.update(req);
      Response.send({ user: UsersService.getSharable(results.users[0], req.requestor) }, req, res);
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static changePassword: RequestHandler = async (req: IRequest, res) => {
    try {
      const user = await UsersService.changePassword(req);
      Response.send({ user: UsersService.getSharable(user) }, req, res, Token.generate(Token.generatePayload(user)));
    } catch (err) {
      Response.error(err, req, res);
    }
  }
}
