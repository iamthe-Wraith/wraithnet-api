import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';
import { ICampaign } from './campaign';
import { IDnDRace } from './race';
import { IDnDClass } from './class';
import { INote, INoteSharableRef } from '../note';

dayjs.extend(utc);

/*
- name
- race
- class
- exp
- level
- events (like birthday)
- inventory
- contacts(npcs) (will need to be able to add notes for how they know them...these will need to be stored separately from the npc's info)
- notes/content (used in editor)
*/

export interface IPCRequest {
    name: string;
    race: IDnDRace['id'];
    classes: IDnDClass['id'][];
    age: number;
    exp: number;
    note: string;
}

export interface IBasePCRef extends IPCRequest, IBaseResource {
    owner: IUser['id'];
    campaignId: ICampaign['id'];
    markedForDeletion?: boolean;
    note: INote['id'];
}

export interface IBasePC extends IBasePCRef {
    // events
    // inventory
    // contacts
}

export interface IPC extends IBasePC {
    _id: string;
    note: INoteSharableRef;
}

export interface IPCRef extends IBasePCRef {
    _id: string;
}

export interface IPCSharable extends IBasePC {
    id: string;
    expForNextLevel: number;
    level: number;
    note: INoteSharableRef;
}

export interface IPCSharableRef extends IBasePCRef {
    id: string;
    expForNextLevel: number;
    level: number;
}

const PCSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    race: {
        type: Schema.Types.ObjectId,
        ref: 'race',
        required: true,
    },
    classes: [{
        type: Schema.Types.ObjectId,
        ref: 'class',
        required: true,
    }],
    age: {
        type: Number,
        required: true,
    },
    exp: {
        type: Number,
        required: true,
        default: 0,
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'note'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'campaign',
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
    }
});

export const PC = mongoose.model<IPC>('pc', PCSchema);
