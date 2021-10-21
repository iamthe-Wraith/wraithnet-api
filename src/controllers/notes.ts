import { RequestHandler } from "express";
import { NotesService } from "../services/notes";
import { IRequest } from "../types";
import { Response } from '../utils/response';

export class NotesController {
    static createNote: RequestHandler = async (req: IRequest, res) => {
        try {
            const note = await NotesService.createNote(req);
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getNotes: RequestHandler = async (req: IRequest, res) => {
        try {
            const notes = await NotesService.getNotes(req);
            const notesRef = notes.notes.map(note => NotesService.getSharableNote(note));
            Response.send({ ...notes, notes: notesRef }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    } 
}