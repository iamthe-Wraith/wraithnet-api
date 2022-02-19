import dayjs from 'dayjs';
import { ERROR, Themes } from '../constants';
import { IUserSettings, IUserSettingsSharable, UserSettings } from '../models/user-settings';
import { IRequest } from '../types/request';
import CustomError, { asCustomError } from '../utils/custom-error';

export class UserSettingsService {
    static async get(req: IRequest): Promise<IUserSettings> {
        try {
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
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getSharable = (settings: IUserSettings): IUserSettingsSharable => ({
        id: settings._id,
        theme: settings.theme,
        createdAt: settings.createdAt,
        owner: settings.owner,
    });

    static async update(req: IRequest, { theme }: Partial<IUserSettings>): Promise<IUserSettings> {
        try {
            if (!theme) throw new CustomError('No updating settings received', ERROR.UNPROCESSABLE);

            const updates: Partial<IUserSettings> = {};

            if (theme) updates.theme = theme;

            const updatedSettings = await UserSettings.findOneAndUpdate({ owner: req.requestor._id }, updates, { new: true });

            if (!updatedSettings) {
                throw new CustomError('Failed to update settings because the settings were not found.', ERROR.NOT_FOUND);
            }

            return updatedSettings;
        } catch (err) {
            throw asCustomError(err);
        }
    }
}
