/* eslint-disable radix */
import Aws from 'aws-sdk';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
    IImage, IImages, IImageSharable, Image,
} from '../models/image';
import { ERROR } from '../constants';
import { IRequest } from '../types/request';
import CustomError, { asCustomError } from '../utils/custom-error';
import { IUser } from '../models/user';

const S3 = require('aws-sdk/clients/s3');

dayjs.extend(utc);

export interface IGetImageArgs {
    requestor: IUser;
    page?: number;
    pageSize?: number;
    fileName?: string;
    fileTypes?: string[];
}

export class ImageService {
    static async getImages({
        requestor,
        page,
        pageSize,
        fileName,
        fileTypes = [],
    }: IGetImageArgs): Promise<IImages> {
        const query: any = {
            $and: [{ owner: requestor.id }],
        };

        if (!!fileName) query.$and.push({ fileName: { $regex: fileName, $options: 'i' } });
        if (!!fileTypes && fileTypes.length) {
            query.$and.push({
                $or: fileTypes.map(fileType => ({
                    fileName: { $regex: `.${fileType}`, $options: 'i' },
                })),
            });
        }

        const results = await Image
            .find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ fileName: 'asc' })
            .exec();

        return {
            results,
            count: await Image.countDocuments(query),
        };
    }

    static getSharableImage(image: IImage): IImageSharable {
        return {
            fileName: image.fileName,
            fileSize: image.fileSize,
            mimetype: image.mimetype,
            createdAt: image.createdAt,
            url: image.url,
            owner: image.owner,
            id: image._id,
        };
    }

    static upload(req: IRequest): Promise<any> {
    // https://aws.plainenglish.io/how-to-upload-photos-to-amazon-s3-bucket-using-node-js-b567188a662a
    // and
    // https://stackoverflow.com/questions/58622647/how-to-upload-file-into-wasabi-bucket-with-s3-api-with-node-js

        const wasabiEndpoint = new Aws.Endpoint(process.env.WASABI_IMAGES_BUCKET_URI);
        const s3 = new S3({
            endpoint: wasabiEndpoint,
            region: 'us-east-2',
            accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
            secretAccessKey: process.env.WASABI_ACCESS_KEY_SECRET,
        });

        const params = {
            Bucket: process.env.WASABI_IMAGES_BUCKET_NAME,
            Key: `${req.requestor._id}_${req.file.originalname}`,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, async (error: Error, data: Aws.S3.ManagedUpload.SendData) => {
                if (error) {
                    reject(new CustomError(error.message, ERROR.SERVER));
                }

                const image = new Image({
                    fileName: req.file.originalname,
                    mimetype: req.file.mimetype,
                    fileSize: req.file.size,
                    url: data.Location,
                    owner: req.requestor._id,
                    createdAt: dayjs.utc().format(),
                });

                try {
                    const result = await image.save();
                    resolve(result);
                } catch (err) {
                    throw asCustomError(err);
                }
            });
        });
    }
}
