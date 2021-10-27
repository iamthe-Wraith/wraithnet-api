import { Document, Types } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ICollectionResponse, IRequest } from '../types';
import { INote, INoteRef, INoteSharableRef, Note, ReservedNoteCategory } from '../models/note';
import CustomError, { asCustomError } from '../utils/custom-error';
import { ERROR } from '../constants';
import { ROLE } from '../models/user';
import { generateSlug } from '../utils';

dayjs.extend(utc);

export class NotesService {
    static async createNote (req: IRequest): Promise<INote & Document<any, any, INote>> {
        console.log('body: ', req.body);

        const { name, text = '', category, access = [] } = (req.body as {
            name: string;
            text?: string;
            category: string;
            access?: string[];
        });

        // ensure a name has been provided
        if (!name) throw new CustomError('a note name is required', ERROR.INVALID_ARG);

        // if a category is provided, check if it is a reserved
        // if so, only admins can used reserved categories
        if (category) {
            if (!!Object.values(ReservedNoteCategory).find(r => r === category) && req.requestor.role > ROLE.ADMIN) {
                throw new CustomError('you do not have permissions to use this reserved category', ERROR.INVALID_ARG);
            }
        } else {
            throw new CustomError('a note category is required', ERROR.INVALID_ARG)
        }

        // ensure that access is an array and that only contains
        // `all` (admins only) or value user ids
        if (Array.isArray(access)) {
            const invalidAccess = access.filter(a => a !== 'all' && !Types.ObjectId.isValid(a));
            if (invalidAccess.length) throw new CustomError(`invalid access id${invalidAccess.length ? 's' : ''} found: ${invalidAccess.join(', ')}`);
        } else {
            throw new CustomError('invalid access rights provided', ERROR.INVALID_ARG)
        }

        // only allow note to be shared with all users if requestor
        // is an admin and category is a reserved category
        if (access.find(a => a === 'all')) {
            if (req.requestor.role > ROLE.ADMIN) {
                throw new CustomError('you do not have permissions to share this note with all users', ERROR.UNAUTHORIZED);
            }

            if (!Object.values(ReservedNoteCategory).find(c => c === category)) {
                throw new CustomError('the category cannot be shared with all users', ERROR.INVALID_ARG)
            }
        }

        const note = new Note({
            owner: req.requestor.id,
            access,
            name,
            category,
            text,
            slug: generateSlug(name),
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
            note = await NotesService.getNoteById(req);
        } catch (err) {
            throw asCustomError(err);
        }

        if ((Object.values(ReservedNoteCategory).find(r => r === note.category) || !!note.access?.find(a => a === 'all')) && req.requestor.role > ROLE.ADMIN) {
            throw new CustomError('you are not authorized to delete this note', ERROR.UNAUTHORIZED);
        }

        note.markedForDeletion = true;
        note.lastModified = dayjs.utc().toDate();

        try {
            await note.save();
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getNoteById (req: IRequest): Promise<INote & Document<any, any, INote>> {
        const { id } = req.params;
        if (!id) throw new CustomError('a note id is required', ERROR.INVALID_ARG);

        try {
            return await NotesService.getNote(req, [{_id: id}]);
        } catch (err) {
            throw asCustomError(err);
        }
    }

    /**
     * gets a note by it's slug.
     * 
     * @important - assumes the combination of category and slug are unique
     * @param req {IRequest}
     * @returns INote & Document<any, any, INote>
     */
    static async getNoteBySlug (req: IRequest): Promise<INote & Document<any, any, INote>> {
        const { category, slug } = req.params;
        if (!category) throw new CustomError('a category is required', ERROR.INVALID_ARG);
        if (!slug) throw new CustomError('a slug is required', ERROR.INVALID_ARG);
        
        try {
            return await NotesService.getNote(req, [{ slug }, { category }]);
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getNote (req: IRequest, q: { [key: string]: any }[] = []): Promise<INote & Document<any, any, INote>> {
        const query: any = {
            $and: [
                ...q,
                { markedForDeletion: false },
                { $or: [
                    { owner: req.requestor.id },
                    { access: { "$in": [req.requestor.id, 'all'] } }
                ] }
            ],
        };

        try {
            const note = await Note.findOne(query);
            if (!note) throw new CustomError('note not found', ERROR.NOT_FOUND);
            return note;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getNotes (req: IRequest): Promise<ICollectionResponse<INoteRef>> {
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
            $and: [
                { markedForDeletion: false },
                { category },
                { $or: [
                    { owner: req.requestor.id },
                    { access: { $in: [req.requestor.id, 'all'] } }
                ] }
            ]
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
            const results = await Note
                .find(query)
                .skip(_page * _pageSize)
                .limit(_pageSize)
                .sort({ name: 'asc' })
                .exec();

            return {
                results,
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
            access: note.access,
            owner: note.owner,
            createdAt: note.createdAt,
            name: note.name,
            category: note.category,
            slug: note.slug,
        };

        if (note.lastModified) noteRef.lastModified = dayjs.utc().toDate();

        return noteRef;
    }

    static async updateNote (req: IRequest): Promise<INote & Document<any, any, INote>> {
        const { name, text, category, access } = (req.body as {
            name?: string;
            text?: string;
            category?: string;
            access?: string[];
        });

        if (!name && !text && !category && !access) throw new CustomError('no updating content found', ERROR.INVALID_ARG);

        let note: INote & Document<any, any, INote>;
        try {
            note = await NotesService.getNoteById(req);
        } catch (err) {
            throw asCustomError(err);
        }

        if (name) {
            note.name = name;
            note.slug = generateSlug(name);
        }

        if (text) note.text = text;

        // if a category is provided, check if it is a reserved
        // if so, only admins can used reserved categories
        if (category) {
            if (Object.values(ReservedNoteCategory).find(r => r === category) && req.requestor.role > ROLE.ADMIN) {
                throw new CustomError('you do not have permissions to use this reserved category', ERROR.INVALID_ARG);
            }

            if (Object.values(ReservedNoteCategory).find(r => r === note.category) && req.requestor.role > ROLE.ADMIN) {
                throw new CustomError('you do not have permissions to change this note\'s category', ERROR.INVALID_ARG);
            }

            note.category = category;
        }


        if (access) {
            // ensure that access is an array and that only contains
            // `all` (admins only) or value user ids
            if (Array.isArray(access)) {
                const invalidAccess = access.filter(a => a !== 'all' && !Types.ObjectId.isValid(a));
                if (invalidAccess.length) throw new CustomError(`invalid access id${invalidAccess.length ? 's' : ''} found: ${invalidAccess.join(', ')}`);
            } else {
                throw new CustomError('invalid access rights provided', ERROR.INVALID_ARG)
            }

            // only allow note to be shared with all users if requestor
            // is an admin and category is a reserved category
            if (access.find(a => a === 'all')) {
                if (req.requestor.role > ROLE.ADMIN) {
                    throw new CustomError('you do not have permissions to share this note with all users', ERROR.UNAUTHORIZED);
                }

                if (!Object.values(ReservedNoteCategory).find(c => c === category)) {
                    throw new CustomError('the category cannot be shared with all users', ERROR.INVALID_ARG)
                }
            }
        }

        // if this note is already shared with all users, only admins
        // can change this
        if (note.access?.find(a => a === 'all') && req.requestor.role > ROLE.ADMIN) {
            throw new CustomError('you do not have permissions to change this note\'s access', ERROR.UNAUTHORIZED);
        }

        note.access = access;

        note.lastModified = dayjs.utc().toDate();

        try {
            await note.save();
            return note;
        } catch (err) {
            throw asCustomError(err);
        }
    }
}