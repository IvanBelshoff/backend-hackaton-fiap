import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { UsuariosProvider } from '../../models/usuarios';
import { validation } from '../../shared/middlewares';
import { JWTService, PasswordCrypto } from '../../shared/services';
import { IBodyLoginUsuarios, ILogin } from '../../shared/interfaces';

export const loginValidation = validation((getSchema) => ({
    body: getSchema<IBodyLoginUsuarios>(yup.object().shape({
        email: yup.string().required().email().min(13),
        senha: yup.string().required().min(6),
    })),
}));

export const login = async (req: Request<{}, {}, IBodyLoginUsuarios>, res: Response) => {

    const { email, senha } = req.body;

    const usuario = await UsuariosProvider.getByEmail(String(email));

    if (usuario instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'E-mail ou senha são inválidos'
            }
        });
    }

    if (usuario.bloqueado == true) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Usuário bloqueado'
            }
        });
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(String(senha), String(usuario.senha));

    if (!passwordMatch) {

        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'E-mail ou senha são inválidos'
            }
        });

    } else {

        const accessToken = JWTService.sign({ uid: usuario.id });

        if (accessToken === 'JWT_SECRET_NOT_FOUND') {

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'Erro ao gerar o token de acesso'
                }
            });

        }

        const usuarioLogin = await UsuariosProvider.updateDateLogin(Number(usuario.id));

        if (usuarioLogin instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: usuarioLogin.message
                }
            });
        }

        const login: ILogin = {
            accessToken: accessToken,
            id: Number(usuario.id),
            typeUser: usuario.tipo_usuario,
            api_key: usuario.api_key,
            foto: {
                nome: usuario.foto.nome || 'profile.jpg',
                originalname: usuario.foto.originalname || 'profile.jpg',
                width: usuario.foto.width || 462,
                height: usuario.foto.height || 462,
                url: usuario.foto.url || `http://${process.env.HOST}:${process.env.PORT}/profile/profile.jpg`,
                tamanho: usuario.foto.tamanho || 6758
            }
        };

        return res.status(StatusCodes.OK).json(login);
    }
};