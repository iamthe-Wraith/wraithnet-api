import mongoose, { Document, Schema } from 'mongoose';
import { IBaseResource } from '../types';
import { IUser } from './user';

export interface IBaseImage extends IBaseResource {
    owner: IUser['id'];
    fileName: string;
    mimetype: string;
    fileSize: number;
    url: string;
}

export interface IImage extends IBaseImage, Document<string> {
    _id: string;
}

export interface IImageSharable extends IBaseImage {
    id: string;
}

export interface IImages {
    count: number;
    results: IImage[];
}

const ImageSchema = new mongoose.Schema({
    fileName: {
        type: String,
    },
    mimetype: {
        type: String,
    },
    fileSize: {
        type: Number,
    },
    url: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    createdAt: {
        type: Date,
    },
});

export const Image = mongoose.model<IImage>('image', ImageSchema);
