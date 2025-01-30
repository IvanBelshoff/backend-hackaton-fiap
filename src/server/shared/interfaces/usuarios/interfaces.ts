import { Usuario } from '../../../database/entities';

export interface IBodyCreateUsuarios extends Omit<Usuario, 'id' | 'data_criacao' | 'data_atualizacao' | 'foto' | 'planos' | 'bloqueado'> { bloqueado?: boolean}

export interface IQueryGetAllUsuarios {
    page?: number;
    limit?: number;
    filter?: string;
}

export interface IBodyLoginUsuarios extends Pick<Usuario, 'email' | 'senha'> { }

export interface IBodyRecoverPasswordUsuarios { emailRecuperacao: string }

export interface IQueryRecoverPasswordUsuarios {
    tipo?: 'capitalizado' | 'minusculo' | 'maiusculo';
    caracteres?: number;
    cumprimento?: number;
    tema?: 'aleatorios' | 'cidades' | 'paises' | 'tecnologias';
    numeros?: number;
}

export interface IBodyUpdateByIdUsuarios extends Omit<Usuario, 'id' | 'bloqueado' | 'data_criacao' | 'data_atualizacao' | 'foto' | 'planos'> { bloqueado?: boolean }

export interface IEmailValidaEmailUsuario {
    email?: string
}

export interface IBodyPassword { senha: string }
