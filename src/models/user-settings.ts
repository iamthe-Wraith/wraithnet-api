import mongoose, { Document, Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../types';
import { IUser } from './user';
import { Themes } from '../constants';

dayjs.extend(utc);

export interface IBaseUserSettings extends IBaseResource {
    owner: IUser['id'];
    theme: Themes;
    markedForDeletion?: boolean;
}

export interface IUserSettings extends IBaseUserSettings, Document<string> {}

export interface IUserSettingsSharable extends IBaseUserSettings {
    id: string;
}

const UserSettingsSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    theme: {
        type: String,
        enum: Object.values(Themes),
        default: Themes.Breeze,
    },
    createdAt: {
        type: Date,
        default: dayjs.utc().toDate(),
    },
    lastModified: {
        type: Date,
    },
    markedForDeletion: {
        type: Boolean,
        default: false,
    },
});

export const UserSettings = mongoose.model<IUserSettings>('user-setting', UserSettingsSchema);
