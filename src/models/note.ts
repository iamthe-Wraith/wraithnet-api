import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../types';
import { IUser } from './user';

dayjs.extend(utc);

export enum ReservedNoteCategory {
    DND_MISC = '__dnd_misc_resource',
}

export interface IBaseNoteRef extends IBaseResource {
    owner: IUser['id'];
    access?: string[];
    markedForDeletion?: boolean;
    name: string;
    category: string;
}

export interface IBaseNote extends IBaseNoteRef {
    text: string;
}

export interface INote extends IBaseNote {
    _id: string;
}

export interface INoteSharable extends IBaseNote {
    id: string;
}

export interface INoteRef extends IBaseNoteRef {
    _id: string;
}

export interface INoteSharableRef extends IBaseNoteRef {
    id: string;
}

export interface INotes {
    count: number;
    notes: INote[];
}

const NoteSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    access: [{
        type: String
    }],
    name: {
        required: true,
        type: String,
    },
    text: {
        type: String,
    },
    category: {
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
    markedForDeletion: {
        type: Boolean,
        default: false,
    }
});

export const Note = mongoose.model<INote>('note', NoteSchema);