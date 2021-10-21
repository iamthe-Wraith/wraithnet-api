import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IRequest } from '../types';
import { INote, INoteRef, INotes, Note } from '../models/note';
import CustomError, { asCustomError } from '../utils/custom-error';
import { ERROR } from '../constants';

dayjs.extend(utc);

export class NotesService {
    static async createNote (req: IRequest): Promise<INote> {
        const { name, text = '', category } = req.body;

        if (!name) throw new CustomError('a note name is required', ERROR.INVALID_ARG);
        if (!category) throw new CustomError('a note category is required', ERROR.INVALID_ARG);

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
        return {
            owner: note.owner,
            createdAt: note.createdAt,
            name: note.name,
            category: note.category,
        };
    }
}