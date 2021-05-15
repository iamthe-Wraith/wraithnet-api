import { RequestHandler } from 'express';
import { Response } from '../utils/response';
import { AuthService } from '../services/auth';
import { IController } from '../types';

export class AuthController implements IController {
  static authenticate:RequestHandler = async (req, res) => {
    try {
      const token = await AuthService.authenticate(req);
      Response.send(null, req, res, token);
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static verifyToken:RequestHandler = (req, res) => {
    Response.send(null, req, res);
  }
}
