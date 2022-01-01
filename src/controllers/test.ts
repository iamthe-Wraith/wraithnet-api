import { RequestHandler } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IRequest } from '../types/request';
import { Response } from '../utils/response';
import CustomError from '../utils/custom-error';

dayjs.extend(utc);

export class TestController {
    static getServerTime: RequestHandler = async (req: IRequest, res) => {
        try {
            const utcTime = dayjs.utc();
            Response.send({ time: utcTime.format() }, req, res);
        } catch (err) {
            Response.error(err as CustomError, req, res);
        }
    };
}
