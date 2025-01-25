import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
import { Foto, TipoUsuario } from '../../../database/entities';

export interface IParamsIdGlobal { id?: number }

export interface IJwtData { uid: number }

export interface IMulterConfigOptions {
    dest: string;
    storage: StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => void;
    limits: {
        fileSize: number;
    };
}

export type JwtPayload = {
    uid: string
    sub: string
}

export interface IBody {
    email?: string
}

export interface IResponseErros {
    status: number;
    default?: string;
    body?: IBody;
}

export interface IFoto extends Pick<Foto, 'nome' | 'originalname' | 'width' | 'height' | 'url' | 'tamanho'> { }

export interface ILogin {
    accessToken: string;
    id: number;
    typeUser: TipoUsuario,
    foto: IFoto;
}
