/* eslint-disable radix */
import { RequestHandler } from 'express';

import { Response } from '../utils/response';
import { IRequest } from '../types/request';
import { ImageService } from '../services/image';
import CustomError from '../utils/custom-error';
import { ERROR } from '../constants';

interface IGetQueryParams {
  page: string;
  pageSize: string;
  fileName: string;
  fileTypes: string;
}

export class ImageController {
  static getImages:RequestHandler = async (req:IRequest, res) => {
    const {
      page,
      pageSize,
      fileName,
      fileTypes,
    } = (req.query as unknown as IGetQueryParams);

    try {
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

      const images = await ImageService.getImages({
        requestor: req.requestor,
        page: _page,
        pageSize: _pageSize,
        fileTypes: fileTypes.split(','),
        fileName,
      });
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
