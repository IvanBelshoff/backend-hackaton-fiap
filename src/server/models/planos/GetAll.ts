import { Plano } from '../../database/entities';
import { planoRepository } from '../../database/repositories/planoRepository';

export const getAll = async (
    page?: number,
    limit?: number,
    filter?: string): Promise<Plano[] | Error> => {
    try {

        const result = planoRepository.createQueryBuilder('plano')
            .orderBy('plano.data_criacao', 'DESC');

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.take(page * limit);
            result.take(limit);
        }

        if (typeof filter === 'string') {
            result.andWhere('LOWER(plano.tema) LIKE LOWER(:tema)', { tema: `%${filter}%` });
        }

        const planos = await result.getMany();

        return planos;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};