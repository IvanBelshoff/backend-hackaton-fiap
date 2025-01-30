import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import { IBodyPassword, IParamsIdGlobal } from '../../shared/interfaces';
import { UsuariosProvider } from '../../models/usuarios';

export const resetPasswordByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyPassword>(yup.object().shape({
        senha: yup
            .string()
            .required('A senha é obrigatória')
            .min(8, 'A senha deve ter no mínimo 8 caracteres')
            .max(30, 'A senha deve ter no máximo 50 caracteres')
            .matches(/[A-Z]/, 'A senha deve conter pelo menos 1 letra maiúscula')
            .matches(/[0-9]/, 'A senha deve conter pelo menos 1 número')
            .matches(/[@$!%*?&]/, 'A senha deve conter pelo menos 1 caractere especial (@, $, !, %, *, ?, &)')
            .matches(/^[\w@$!%*?&]+$/, 'A senha não deve conter caracteres inválidos'),
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const resetPasswordById = async (req: Request<IParamsIdGlobal, {}, IBodyPassword>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await UsuariosProvider.resetPasswordById(req.params.id, req.body.senha);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
};