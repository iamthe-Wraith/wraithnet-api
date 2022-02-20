import { RequestHandler } from 'express';
import { IUserSettings } from '../models/user-settings';
import { UserSettingsService } from '../services/user-settings';
import { IRequest } from '../types/request';
import { Response } from '../utils/response';

export class UserSettingsController {
    static get: RequestHandler = async (req: IRequest, res) => {
        try {
            const settings = await UserSettingsService.get(req);
            Response.send(UserSettingsService.getSharable(settings), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static update: RequestHandler = async (req: IRequest, res) => {
        try {
            const settings = await UserSettingsService.update(req, req.body as Partial<IUserSettings>);
            Response.send(UserSettingsService.getSharable(settings), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };
}
