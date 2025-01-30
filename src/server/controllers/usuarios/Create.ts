import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import sharp from 'sharp';
import { UsuariosProvider } from '../../models/usuarios';
import { IBodyCreateUsuarios, IResponseErros } from '../../shared/interfaces';
import { decoder, validation } from '../../shared/middlewares';
import { deleteArquivoLocal } from '../../shared/services';
import { FotosProvider } from '../../models/fotos';
import { TipoUsuario } from '../../database/entities';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyCreateUsuarios>(yup.object().shape({
        nome: yup.string().required().min(3),
        sobrenome: yup.string().required().min(3),
        senha: yup.string().required().min(6),
        email: yup.string().required().email().min(5),
        api_key: yup.string().required(),
        bloqueado: yup.boolean().optional(),
        tipo_usuario: yup.string().required().oneOf(Object.values(TipoUsuario), 'Inválido')
    })),
}));

export const create = async (req: Request<{}, {}, IBodyCreateUsuarios>, res: Response) => {

    const usuario = await decoder(req);

    const validaEmail = await UsuariosProvider.validaEmailUsuario(req.body.email);

    if (validaEmail instanceof Error) {

        if (req.file) {

            const deleteFoto = await deleteArquivoLocal(req.file.path, req.file.originalname);

            if (deleteFoto instanceof Error) {
                console.log(deleteFoto.message);
            }
        }

        const response: IResponseErros = JSON.parse(validaEmail.message);

        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(validaEmail.message)
        });
    }

    if (req.file) {

        const imageBuffer = req.file.path;
        const metadata = await sharp(imageBuffer).metadata();

        const resultFoto = await FotosProvider.create({
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            originalname: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            width: metadata.width,
            height: metadata.height
        });

        if (resultFoto instanceof Error) {

            const deleteFotolocal = await deleteArquivoLocal(req.file.path, req.file.originalname);

            if (deleteFotolocal instanceof Error) {
                console.log(deleteFotolocal.message);
            }

            const deleteFoto = await FotosProvider.deleteByFilename(req.file.filename);

            if (deleteFoto instanceof Error) {
                console.log(deleteFoto.message);
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultFoto.message
                }
            });
        }

        const resultUsuario = await UsuariosProvider.create({
            ...req.body,
            usuario_cadastrador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            usuario_atualizador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            id_foto: resultFoto
        });

        if (resultUsuario instanceof Error) {

            const deleteFotoLocal = await deleteArquivoLocal(req.file.path, req.file.originalname);

            if (deleteFotoLocal instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: {
                        default: resultUsuario.message
                    }
                });
            }

            const deleteFoto = await FotosProvider.deleteByFilename(req.file.filename);

            if (deleteFoto instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: {
                        default: deleteFoto.message
                    }
                });
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultUsuario.message
                }
            });
        }

        return res.status(StatusCodes.CREATED).json(resultUsuario);

    } else {

        const resultFoto = await FotosProvider.createNoFile();

        if (resultFoto instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultFoto.message
                }
            });
        }

        const resultUsuario = await UsuariosProvider.create({
            ...req.body,
            usuario_cadastrador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            usuario_atualizador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            id_foto: resultFoto
        });

        if (resultUsuario instanceof Error) {

            const deleteFoto = await FotosProvider.deleteById(resultFoto);

            if (deleteFoto instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: {
                        default: resultUsuario.message
                    }
                });
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultUsuario.message
                }
            });
        }

        return res.status(StatusCodes.CREATED).json(resultUsuario);

    }

};

