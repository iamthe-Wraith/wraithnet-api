/* eslint-disable radix */
import Aws from 'aws-sdk';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
    IImage, IImages, IImageSharable, Image,
} from '../models/image';
import { ERROR } from '../constants';
import { IRequest } from '../types';
import CustomError, { asCustomError } from '../utils/custom-error';

const S3 = require('aws-sdk/clients/s3');

dayjs.extend(utc);

export class ImageService {
    static async getImages(req: IRequest): Promise<IImages> {
        const { page, pageSize } = (req.query as { page: string, pageSize: string });

        const query: any = {
            $and: [{ owner: req.requestor.id }],
        };

        let _page = 0;
        if (page) {
            _page = parseInt(page);
            if (isNaN(_page)) throw new CustomError('invalid page found', ERROR.INVALID_ARG);
        }

        let _pageSize = 50;
        if (pageSize) {
            _pageSize = parseInt(pageSize);
            if (isNaN(_pageSize)) throw new CustomError('invalid pageSize found', ERROR.INVALID_ARG);
        }

        const results = await Image
            .find(query)
            .sort({ name: 'asc' })
            .skip(_page * _pageSize)
            .limit(_pageSize)
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
