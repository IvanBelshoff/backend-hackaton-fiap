import { planoRepository } from '../../database/repositories/planoRepository';

export const count = async (id: number, filter?: string): Promise<number | Error> => {
    try {

        const result = planoRepository.createQueryBuilder('plano')
            .leftJoinAndSelect('plano.usuario', 'usuario')
            .orderBy('plano.data_criacao', 'DESC')
            .where('usuario.id = :id', { id });

        if (typeof filter === 'string') {
            result.andWhere('LOWER(plano.tema) LIKE LOWER(:tema)', { tema: `%${filter}%` });
        }

        const count = await result.getCount();

        return count;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }
};