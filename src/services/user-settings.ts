import dayjs from 'dayjs';
import { Themes } from '../constants';
import { IUserSettings, IUserSettingsSharable, UserSettings } from '../models/user-settings';
import { IRequest } from '../types/request';

export class UserSettingsService {
    static async get(req: IRequest): Promise<IUserSettings> {
        let settings = await UserSettings.findOne({ owner: req.requestor._id });

        if (!settings) {
            // create default settings...
            settings = new UserSettings({
                owner: req.requestor,
                createdAt: dayjs().utc().toDate(),
                theme: Themes.Breeze,
            });
            await settings.save();
        }

        return settings;
    }

    static getSharable = (settings: IUserSettings): IUserSettingsSharable => ({
        id: settings._id,
        theme: settings.theme,
        createdAt: settings.createdAt,
        owner: settings.owner,
    });
}
