import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { decoder, validation } from '../../shared/middlewares';
import { IQueryGetAllUsuarios } from '../../shared/interfaces';
import { PlanosProvider } from '../../models/planos';

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryGetAllUsuarios>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional()
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryGetAllUsuarios>, res: Response) => {


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usuario = await decoder(req as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>);

    if (!usuario) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O usuário precisa ser informado'
            }
        });
    }

    const result = await PlanosProvider.getAll(
        usuario.id,
        req.query.page,
        req.query.limit,
        req.query.filter,
    );

    const count = await PlanosProvider.count(usuario.id, req.query.filter);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        });
    } else if (count instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: count.message }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};
