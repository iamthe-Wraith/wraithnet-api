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

    static deleteNote: RequestHandler = async (req: IRequest, res) => {
        try {
            const note = await NotesService.deleteNote(req);
            Response.send(null, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    }

    static getNote: RequestHandler = async (req: IRequest, res) => {
        try {
            const note = await NotesService.getNote(req);
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    } 

    static getNotes: RequestHandler = async (req: IRequest, res) => {
        try {
            const notes = await NotesService.getNotes(req);
            const noteRefs = notes.results.map(note => NotesService.getSharableNoteRef(note));
            Response.send({ ...notes, results: noteRefs }, req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    } 

    static updateNote: RequestHandler = async (req: IRequest, res) => {
        try {
            const note = await NotesService.updateNote(req);
            Response.send(NotesService.getSharableNote(note), req, res);
        } catch (err: any) {
            Response.error(err, req, res);
        }
    } 
}