import { RequestHandler } from 'express';

import { Response } from '../utils/response';
import { IRequest } from '../types/request';
import { ImageService } from '../services/image';

export class ImageController {
    static getImages:RequestHandler = async (req:IRequest, res) => {
        try {
            const images = await ImageService.getImages(req);
            Response.send({ ...images, results: images.results.map(image => ImageService.getSharableImage(image)) }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static uploadImage:RequestHandler = async (req:IRequest, res) => {
        try {
            const image = await ImageService.upload(req);
            Response.send(ImageService.getSharableImage(image), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };
}
