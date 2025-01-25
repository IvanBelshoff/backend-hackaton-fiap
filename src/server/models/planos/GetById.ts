import { Plano } from '../../database/entities';
import { planoRepository } from '../../database/repositories/planoRepository';

export const getById = async (id: number): Promise<Plano | Error> => {

    try {
        const result = await planoRepository.findOne({
            relations: {
                usuario: true
            },
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Plano não encontrado');
        }

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};