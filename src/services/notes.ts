import { Document } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IRequest } from '../types';
import { INote, INoteRef, INotes, INoteSharableRef, Note, NoteCategory } from '../models/note';
import CustomError, { asCustomError } from '../utils/custom-error';
import { ERROR } from '../constants';

dayjs.extend(utc);

const isValidCategory = (category: string) => {
    return !!Object.values(NoteCategory).find(nc => nc === category);
}

export class NotesService {
    static async createNote (req: IRequest): Promise<INote & Document<any, any, INote>> {
        const { name, text = '', category } = req.body;

        if (!name) throw new CustomError('a note name is required', ERROR.INVALID_ARG);
        if (!category) throw new CustomError('a note category is required', ERROR.INVALID_ARG);
        if (!isValidCategory(category)) throw new CustomError('invalid category', ERROR.INVALID_ARG);
        
        const note = new Note({
            owner: req.requestor.id,
            name,
            category,
            text,
            createdAt: dayjs.utc().format(),
        });

        try {
            await note.save();
            return note;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async deleteNote (req: IRequest): Promise<void> {
        let note: INote & Document<any, any, INote>;
        try {
            note = await NotesService.getNote(req);
        } catch (err) {
            throw asCustomError(err);
        }

        note.markedForDeletion = true;
        note.lastModified = dayjs.utc().toDate();

        try {
            await note.save();
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getNote (req: IRequest): Promise<INote & Document<any, any, INote>> {
        const { id } = req.params;

        if (!id) throw new CustomError('a note id is required', ERROR.INVALID_ARG);

        const query = {
            owner: req.requestor.id,
            markedForDeletion: false,
            _id: id,
        }

        try {
            const note = await Note.findOne(query);
            if (!note) throw new CustomError('note not found', ERROR.NOT_FOUND);
            return note;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getNotes (req: IRequest): Promise<INotes> {
        const {
            category,
            page,
            pageSize,
        } = (req.query as {
            category: string;
            page: string;
            pageSize: string;
        });

        if (!category) throw new CustomError('a note category is required', ERROR.INVALID_ARG);
        if (!isValidCategory(category)) throw new CustomError('this is not a valid category', ERROR.INVALID_ARG);

        const query: any = {
            $and: [{ owner: req.requestor.id }, { markedForDeletion: false }, { category }],
        };

        let _page = 0;
        if (page) {
            _page = parseInt(page);
            if (isNaN(_page)) throw new CustomError('invalid page found', ERROR.INVALID_ARG);
        }

        let _pageSize = 25;
        if (pageSize) {
            _pageSize = parseInt(pageSize);
            if (isNaN(_pageSize)) throw new CustomError('invalid pageSize found', ERROR.INVALID_ARG);
        }

        try {
            const results = await Note.find(query)
                .find(query)
                .skip(_page * _pageSize)
                .limit(_pageSize)
                .sort({ name: 'asc' })
                .exec();

            return {
                notes: results,
                count: await Note.countDocuments(query)
            };
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getSharableNote (note: INote) {
        return {
            ...NotesService.getSharableNoteRef(note),
            text: note.text,
        }
    }

    static getSharableNoteRef (note: INote | INoteRef) {
        const noteRef: INoteSharableRef = {
            id: note._id,
            owner: note.owner,
            createdAt: note.createdAt,
            name: note.name,
            category: note.category,
        };

        if (note.lastModified) noteRef.lastModified = dayjs.utc().toDate();

        return noteRef;
    }

    static async updateNote (req: IRequest): Promise<INote & Document<any, any, INote>> {
        const { name, text, category } = (req.body as {
            name?: string;
            text?: string;
            category?: string;
        });

        if (!name && !text && !category) throw new CustomError('no updating content found', ERROR.INVALID_ARG);

        let note: INote & Document<any, any, INote>;
        try {
            note = await NotesService.getNote(req);
        } catch (err) {
            throw asCustomError(err);
        }

        if (name) note.name = name;
        if (text) note.text = text;
        if (category) {
            if (isValidCategory(category)) {
                note.category = category as NoteCategory;
            } else {
                throw new CustomError('invalid category', ERROR.INVALID_ARG);
            }
        };
        note.lastModified = dayjs.utc().toDate();

        try {
            await note.save();
            return note;
        } catch (err) {
            throw asCustomError(err);
        }
    }
}