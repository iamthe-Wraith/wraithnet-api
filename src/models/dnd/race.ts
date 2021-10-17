import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';

dayjs.extend(utc);

export interface IBaseDnDRace extends IBaseResource {
    name: string;
}

export interface IDnDRace extends IBaseDnDRace {
    _id: string;
}

export interface IDnDRaceSharable extends IBaseDnDRace {
    id: string;
}

const DnDRaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: dayjs.utc().toDate(),
    },
    lastModified: {
        type: Date,
    },
});

export const DnDRace = mongoose.model<IDnDRace>('race', DnDRaceSchema);
