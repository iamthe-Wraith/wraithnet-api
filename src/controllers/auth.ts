import { RequestHandler } from 'express';
import { Response } from '../utils/response';
import { AuthService } from '../services/auth';
import CustomError from '../utils/custom-error';

export class AuthController {
  static authenticate:RequestHandler = async (req, res) => {
    try {
      const token = await AuthService.authenticate(req);
      Response.send(null, req, res, token);
    } catch (err: any) {
      Response.error(err as CustomError, req, res);
    }
  };

  static verifyToken:RequestHandler = (req, res) => {
    Response.send(null, req, res);
  };
}
