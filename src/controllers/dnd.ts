import { RequestHandler } from 'express';

import { Response } from '../utils/response';

import { DnDService } from '../services/dnd';
import { IRequest } from '../types';

export class DnDController {
    static addChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            const item = await DnDService.addChecklistItem(req);
            Response.send(DnDService.getSharableItem(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static createCampaign: RequestHandler = async (req: IRequest, res) => {
        try {
            const campaign = await DnDService.createCampaign(req);
            Response.send(DnDService.getSharableCampaign(campaign), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static deleteCampaign: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteCampaign(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static deleteChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteChecklistItem(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getCalendar: RequestHandler = async (req: IRequest, res) => {
        try {
            const calendar = DnDService.getCalendar();
            Response.send(calendar, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getCampaigns: RequestHandler = async (req: IRequest, res) => {
        try {
            const campaigns = await DnDService.getCampaigns(req);
            Response.send(campaigns.map(campaign => DnDService.getSharableCampaign(campaign)), req, res);
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

    static updateCampaign: RequestHandler = async (req: IRequest, res) => {
        try {
            const campaign = await DnDService.updateCampaign(req);
            Response.send(DnDService.getSharableCampaign(campaign), req, res);
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
