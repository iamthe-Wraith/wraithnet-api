import { RequestHandler } from 'express';

import { Response } from '../utils/response';

import { DnDService } from '../services/dnd';
import { IRequest } from '../types/request';
import { dndExp } from '../../static/dnd-exp';
import { NotesService } from '../services/notes';
import { ReservedNoteCategory } from '../models/note';

export class DnDController {
    static addChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            const item = await DnDService.addChecklistItem(req);
            Response.send(DnDService.getSharableItem(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createClass: RequestHandler = async (req: IRequest, res) => {
        try {
            const c = await DnDService.createClass(req);
            Response.send(DnDService.getSharableClass(c), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createCampaign: RequestHandler = async (req: IRequest, res) => {
        try {
            const campaign = await DnDService.createCampaign(req);
            Response.send(DnDService.getSharableCampaign(campaign), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createItem: RequestHandler = async (req: IRequest, res) => {
        try {
            const item = await DnDService.createNote(req, 'item');
            Response.send(NotesService.getSharableNote(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createMiscNote: RequestHandler = async (req: IRequest, res) => {
        try {
            req.body.category = ReservedNoteCategory.DND_MISC;
            req.body.access = ['all'];
            const note = await NotesService.createNote(req);
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createLocation: RequestHandler = async (req: IRequest, res) => {
        try {
            const location = await DnDService.createNote(req, 'location');
            Response.send(NotesService.getSharableNote(location), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createMiscCampaignNote: RequestHandler = async (req: IRequest, res) => {
        try {
            const note = await DnDService.createNote(req, 'misc');
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createNPC: RequestHandler = async (req: IRequest, res) => {
        try {
            const npc = await DnDService.createNote(req, 'npc');
            Response.send(NotesService.getSharableNote(npc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createPC: RequestHandler = async (req: IRequest, res) => {
        try {
            const pc = await DnDService.createPC(req);
            Response.send(DnDService.getSharablePC(pc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createQuest: RequestHandler = async (req: IRequest, res) => {
        try {
            const quest = await DnDService.createNote(req, 'quest');
            Response.send(NotesService.getSharableNote(quest), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createRace: RequestHandler = async (req: IRequest, res) => {
        try {
            const race = await DnDService.createRace(req);
            Response.send(DnDService.getSharableRace(race), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static createSession: RequestHandler = async (req: IRequest, res) => {
        try {
            const sessionNote = await DnDService.createNote(req, 'session');
            Response.send(NotesService.getSharableNote(sessionNote), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static deleteCampaign: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteCampaign(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static deleteChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteChecklistItem(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static deleteClass: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteClass(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static deleteMiscNote: RequestHandler = async (req: IRequest, res) => {
        try {
            await NotesService.deleteNote(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static deletePC: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deletePC(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static deleteRace: RequestHandler = async (req: IRequest, res) => {
        try {
            await DnDService.deleteRace(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getCampaigns: RequestHandler = async (req: IRequest, res) => {
        try {
            const campaigns = await DnDService.getCampaigns(req);
            Response.send(campaigns.map(campaign => DnDService.getSharableCampaign(campaign)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getChecklist: RequestHandler = async (req: IRequest, res) => {
        try {
            const checklist = await DnDService.getChecklist(req);
            Response.send(DnDService.getSharableList(checklist), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getClasses: RequestHandler = async (req: IRequest, res) => {
        try {
            const classes = await DnDService.getClasses(req);
            Response.send(classes.map(c => DnDService.getSharableClass(c)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getEvents: RequestHandler = async (req: IRequest, res) => {
        try {
            const { date } = (req.query as { date: string });
            const { campaignId } = req.params;
            const events = await DnDService.getEvents(req.requestor, campaignId, date);
            Response.send(events.map(e => DnDService.getSharableEvent(e)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getItems: RequestHandler = async (req: IRequest, res) => {
        try {
            const items = await DnDService.getNotes(req, 'item');
            Response.send({
                ...items,
                results: items.results.map(item => NotesService.getSharableNoteRef(item)),
            }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getLevels: RequestHandler = async (req: IRequest, res) => {
        try {
            Response.send(dndExp, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getMiscNote: RequestHandler = async (req: IRequest, res) => {
        try {
            const note = await NotesService.getNoteById(req);
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getMiscNotes: RequestHandler = async (req: IRequest, res) => {
        try {
            req.query.category = ReservedNoteCategory.DND_MISC;
            const notes = await NotesService.getNotes(req);
            Response.send({ ...notes, results: notes.results.map(note => NotesService.getSharableNoteRef(note)) }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getLocations: RequestHandler = async (req: IRequest, res) => {
        try {
            const locations = await DnDService.getNotes(req, 'location');
            Response.send({
                ...locations,
                results: locations.results.map(note => NotesService.getSharableNoteRef(note)),
            }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getMiscCampaignNotes: RequestHandler = async (req: IRequest, res) => {
        try {
            const notes = await DnDService.getNotes(req, 'misc');
            Response.send({
                ...notes,
                results: notes.results.map(note => NotesService.getSharableNoteRef(note)),
            }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getNPCs: RequestHandler = async (req: IRequest, res) => {
        try {
            const npcs = await DnDService.getNotes(req, 'npc');
            Response.send({
                ...npcs,
                results: npcs.results.map(note => NotesService.getSharableNoteRef(note)),
            }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getPC: RequestHandler = async (req: IRequest, res) => {
        try {
            const pc = await DnDService.getPC(req);
            Response.send(DnDService.getSharablePC(pc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getPCInventory: RequestHandler = async (req: IRequest, res) => {
        try {
            const inventory = await DnDService.getPCInventory(req);
            Response.send(inventory.map(i => NotesService.getSharableNoteRef(i)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getPCs: RequestHandler = async (req: IRequest, res) => {
        try {
            const pcs = await DnDService.getPCs(req);
            Response.send(pcs.map(pc => DnDService.getSharablePC(pc)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getQuests: RequestHandler = async (req: IRequest, res) => {
        try {
            const quests = await DnDService.getNotes(req, 'quest');
            Response.send({
                ...quests,
                results: quests.results.map(note => NotesService.getSharableNoteRef(note)),
            }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getRaces: RequestHandler = async (req: IRequest, res) => {
        try {
            const races = await DnDService.getRaces(req);
            Response.send(races.map(race => DnDService.getSharableRace(race)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getSessions: RequestHandler = async (req: IRequest, res) => {
        try {
            const sessions = await DnDService.getNotes(req, 'session');
            Response.send({
                ...sessions,
                results: sessions.results.map(note => NotesService.getSharableNoteRef(note)),
            }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static getStats: RequestHandler = async (req: IRequest, res) => {
        try {
            const stats = await DnDService.getStats(req);
            Response.send(stats, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updateCampaign: RequestHandler = async (req: IRequest, res) => {
        try {
            const campaign = await DnDService.updateCampaign(req);
            Response.send(DnDService.getSharableCampaign(campaign), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updateCampaignDate: RequestHandler = async (req: IRequest, res) => {
        try {
            const { direction } = req.body;
            const { campaignId } = req.params;
            const campaign = await DnDService.updateCampaignDate(req.requestor, campaignId, direction);
            Response.send(DnDService.getSharableCampaign(campaign), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updateClass: RequestHandler = async (req: IRequest, res) => {
        try {
            const c = await DnDService.updateClass(req);
            Response.send(DnDService.getSharableClass(c), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updateChecklistItem: RequestHandler = async (req: IRequest, res) => {
        try {
            const item = await DnDService.updateChecklistItem(req);
            Response.send(DnDService.getSharableItem(item), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updateMiscNote: RequestHandler = async (req: IRequest, res) => {
        try {
            req.body.category = ReservedNoteCategory.DND_MISC;
            req.body.access = ['all'];
            const note = await NotesService.updateNote(req);
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updatePartyXP: RequestHandler = async (req: IRequest, res) => {
        try {
            const pcsExp = await DnDService.updatePartyXP(req);
            Response.send(pcsExp.map(x => ({
                pc: DnDService.getSharablePC(x.pc),
                exp: x.exp,
            })), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updatePC: RequestHandler = async (req: IRequest, res) => {
        try {
            const pc = await DnDService.updatePC(req);
            Response.send(DnDService.getSharablePC(pc), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updatePCExp: RequestHandler = async (req: IRequest, res) => {
        try {
            const result = await DnDService.updatePCExp(req);
            Response.send(result, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updatePCInventoryItems: RequestHandler = async (req: IRequest, res) => {
        try {
            const items = await DnDService.updatePCInventoryItems(req);
            Response.send(items.map(item => NotesService.getSharableNoteRef(item)), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };

    static updateRace: RequestHandler = async (req: IRequest, res) => {
        try {
            const race = await DnDService.updateRace(req);
            Response.send(DnDService.getSharableRace(race), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    };
}
