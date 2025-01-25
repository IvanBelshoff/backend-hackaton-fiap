import { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';
import { StatusCodes } from 'http-status-codes';
import { JWTService } from '../services';
import multer from 'multer';
import { createMulterConfigFoto } from './MulterFoto';
import { JwtPayload } from '../interfaces';

export async function decoder(req: Request): Promise<Usuario | undefined> {

    const authorization = req.headers.authorization || '';

    const token = authorization.split(' ')[1];

    if (!token) {
        return undefined;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await usuarioRepository.findOne({
        where: {
            id: Number(decode.uid)
        }
    });

    if (user == null) {
        return undefined;
    }

    return user;

}

const EnsureAuthenticated: RequestHandler = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    const jwtData = JWTService.verify(token);

    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: 'Erro ao verificar o token' }
        });
    } else if (jwtData === 'INVALID_TOKEN') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    req.headers.idUsuario = jwtData.uid.toString();

    return next();
};

const SalvarFoto = () => {

    const uploadMulter: RequestHandler = async (req, res, next) => {

        const upload = multer(createMulterConfigFoto()).single('foto');

        upload(req, res, async function (err) {

            if (err instanceof multer.MulterError) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: { default: `Ocorreu um erro desconhecido durante o upload: ${err.message}` } });
            } else if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: { default: `Ocorreu um erro durante o upload: ${err.message}` } });
            } else {
                next();
            }

        }

        );
    };

    return uploadMulter;
};

export { EnsureAuthenticated, SalvarFoto };