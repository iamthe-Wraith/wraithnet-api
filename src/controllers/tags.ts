import { RequestHandler } from "express";
import { ITag, ITags } from "../models/tag";
import { TagsService } from "../services/tags";
import { IRequest } from "../types";
import { Response } from '../utils/response';

export class TagsController {
    static create: RequestHandler = async (req: IRequest, res) => {
        try {
            const tag = await TagsService.create(req);
            Response.send(TagsService.getSharable(tag), req, res);
        } catch (err) {
            Response.error(err, req, res);
        }
    }

    static delete: RequestHandler = async (req: IRequest, res) => {
        try {
            await TagsService.delete(req);
            Response.send(null, req, res);
        } catch (err) {
            Response.error(err, req, res);
        }   
    }

    static get: RequestHandler = async (req: IRequest, res) => {
        try {
            const tags = await TagsService.get(req);
            if ((tags as ITags)?.tags) {
                const result = {
                    ...tags,
                    tags: (tags as ITags).tags.map(t => TagsService.getSharable(t)),
                }
                Response.send(result, req, res);
            } else {
                Response.send(TagsService.getSharable((tags as ITag)), req, res);
            }
        } catch (err) {
            Response.error(err, req, res);
        }
    }

    static update: RequestHandler = async (req: IRequest, res) => {
        try {
            const tag = await TagsService.update(req);
            Response.send(TagsService.getSharable(tag), req, res);
        } catch (err) {
            Response.error(err, req, res);
        }   
    }
}