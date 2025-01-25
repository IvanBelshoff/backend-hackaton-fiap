import { Plano } from '../../../database/entities';

export interface IBodyCreatePlanos extends Omit<Plano, 'id' | 'data_criacao' | 'data_atualizacao' | 'usuario'> { }
