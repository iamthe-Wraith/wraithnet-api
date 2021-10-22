import { RequestHandler } from 'express';

import { Response } from '../utils/response';

import { DnDService } from '../services/dnd';
import { IRequest } from '../types';
import { dndExp } from '../../static/dnd-exp';

export class DnDController {
    static addChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            const item = await DnDService.addChecklistItem(req);
            Response.send(DnDService.getSharableItem(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static createClass: RequestHandler = async (req: IRequest, res) => {
        try {
            const c = await DnDService.createClass(req);
            Response.send(DnDService.getSharableClass(c), req, res);
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

    static createPC: RequestHandler = async (req: IRequest, res) => {
        try {
            const pc = await DnDService.createPC(req);
            Response.send(DnDService.getSharablePC(pc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static createRace: RequestHandler = async (req: IRequest, res) => {
        try {
            const race = await DnDService.createRace(req);
            Response.send(DnDService.getSharableRace(race), req, res);
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

    static deleteClass: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteClass(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static deletePC: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deletePC(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static deleteRace: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteRace(req);
            Response.send(null, req, res);
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

    static getClasses: RequestHandler = async (req: IRequest, res) => {
        try {            
            const classes = await DnDService.getClasses(req);
            Response.send(classes.map(c => DnDService.getSharableClass(c)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getLevels: RequestHandler = async (req: IRequest, res) => {
        try {
            Response.send(dndExp, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getPC: RequestHandler = async (req: IRequest, res) => {
        try {
            const pc = await DnDService.getPC(req);
            Response.send(DnDService.getSharablePC(pc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getPCs: RequestHandler = async (req: IRequest, res) => {
        try {
            const pcs = await DnDService.getPCs(req);
            Response.send(pcs.map(pc => DnDService.getSharablePCRef(pc)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getRaces: RequestHandler = async (req: IRequest, res) => {
        try {            
            const races = await DnDService.getRaces(req);
            Response.send(races.map(race => DnDService.getSharableRace(race)), req, res);
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


    static updateClass: RequestHandler = async (req: IRequest, res) => {
        try {
            const c = await DnDService.updateClass(req);
            Response.send(DnDService.getSharableClass(c), req, res);
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

    static updatePartyXP: RequestHandler = async (req: IRequest, res) => {
        try {
            const pcsExp = await DnDService.updatePartyXP(req);
            Response.send(pcsExp.map(x => {
                return {
                    pc: DnDService.getSharablePCRef(x.pc),
                    exp: x.exp,
                }
            }), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static updatePC: RequestHandler = async (req: IRequest, res) => {
        try {
            const pc = await DnDService.updatePC(req);
            Response.send(DnDService.getSharablePCRef(pc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static updatePCExp: RequestHandler = async (req: IRequest, res) => {
        try {
            const result = await DnDService.updatePCExp(req);
            Response.send(result, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static updateRace: RequestHandler = async (req: IRequest, res) => {
        try {
            const race = await DnDService.updateRace(req);
            Response.send(DnDService.getSharableRace(race), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    } 
}
