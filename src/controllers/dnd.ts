import { RequestHandler } from 'express';

import { Response } from '../utils/response';

import { DnDService } from '../services/dnd';
import { IRequest } from '../types';

export class DnDController {
    static addChecklistItem: RequestHandler = async (req:IRequest, res) => {
        try {
            const item = await DnDService.addChecklistItem(req);
            Response.send(DnDService.getSharableItem(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getChecklist: RequestHandler = async (req: IRequest, res) => {
        try {
            const checklist = await DnDService.getChecklist(req);
            Response.send(DnDService.getSharableList(checklist), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static updateChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            const item = await DnDService.updateChecklistItem(req);
            Response.send(DnDService.getSharableItem(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    } 
}
