import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { decoder, validation } from '../../shared/middlewares';
import { IBodyCreatePlanos } from '../../shared/interfaces/planos/interfaces';
import { PlanosProvider } from '../../models/planos';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyCreatePlanos>(yup.object().shape({
        tema: yup.string().required(),
        nivel: yup.string().required(),
        conteudo: yup.string().required(),
        duracao: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'O campo \'duracao\' deve estar no formato HH:mm:ss (ex: 08:15:00).').required(),
    })),
}));

export const create = async (req: Request<{}, {}, IBodyCreatePlanos>, res: Response) => {

    const usuario = await decoder(req);

    if (!usuario) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O usuário precisa ser informado'
            }
        });
    }

    const result = await PlanosProvider.create({
        ...req.body,
    }, usuario);

    if(result instanceof Error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.CREATED).json(result);

};

