import { RequestHandler } from 'express';
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
}
