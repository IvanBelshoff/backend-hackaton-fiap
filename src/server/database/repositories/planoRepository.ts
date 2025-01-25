import { AppDataSource } from '../data-source';
import { Plano } from '../entities';

export const planoRepository = AppDataSource.getRepository(Plano);