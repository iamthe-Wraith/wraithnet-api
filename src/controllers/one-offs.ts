import { RequestHandler } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Response } from '../utils/response';
import { IRequest } from '../types/request';
import { magicItems } from '../../.tmp/magicitems';
import { Note, ReservedNoteCategory } from '../models/note';
import { Tag } from '../models/tag';
import { generateSlug } from '../utils';
import { MagicItem } from '../models/dnd/store-item';
import CustomError from '../utils/custom-error';
import { ERROR } from '../constants';

dayjs.extend(utc);

export class OneOffsController {
    static mapMagicItems:RequestHandler = async (req:IRequest, res) => {
        // TODO: auth

        try {
            /**
             * add MagicItem schema from dm bag of holding
             *
             * read desc for each item
             * - create new Note
             * - add dnd_item category
             * - add magic-item tag
             * - save to get id
             *
             * create new MagicItem
             * - set MagicItem.note to _id of the above note
             *
             * update getting dnd_items to also get these new notes...
             * - or should these be shown in misc?
             *
             * update list of equipable items for PCs to show these items as well
             * - should this just be the note still? or do I want to include the other details as well???
             */

            const tags = await Tag.find({
                $and: [
                    { _id: '6194fa15a0ab1300181ac136' }, // magic-item
                    { _id: '61dcc26a748b2e002db6d1a8' }, // store-item
                ],
            });

            for (const magicItem of magicItems) {
                const slug = generateSlug(magicItem.name);
                let note = await Note.findOne({ slug });

                if (!note) {
                    let noteContent = (magicItem.desc || []).join('\n\n');
                    noteContent += `-----\n${magicItem.equipment_category.name}, ${magicItem.rarity}\n\n`;

                    note = new Note({
                        owner: req.requestor.id,
                        access: ['all'],
                        name: magicItem.name,
                        category: ReservedNoteCategory.DND_STORE_MAGIC_ITEM,
                        text: noteContent,
                        createdAt: dayjs.utc().format(),
                        slug,
                        tags,
                    });

                    console.log(`saving note: ${note.name}`);
                    await note.save();
                }

                delete magicItem._id;

                const _magicItem = new MagicItem({
                    ...magicItem,
                    note,
                });

                console.log(`saving magic item: ${magicItem.name}`);
                await _magicItem.save();
            }

            Response.send(null, req, res);
        } catch (err: any) {
            console.log(err);

            if (err.isCustom) {
                Response.error(err, req, res);
            } else {
                Response.error(new CustomError(err.message, ERROR.GEN), req, res);
            }
        }
    };

    static undoMappingMagicItems:RequestHandler = async (req:IRequest, res) => {
        try {
            await Note.deleteMany({ category: 'dnd_store_magic_item' });
            await MagicItem.deleteMany({});

            Response.send(null, req, res);
        } catch (err: any) {
            if (err.isCustom) {
                Response.error(err, req, res);
            } else {
                Response.error(new CustomError(err.message, ERROR.GEN), req, res);
            }
        }
    };
}
