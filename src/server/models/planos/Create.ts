import { Usuario } from '../../database/entities';
import { planoRepository } from '../../database/repositories/planoRepository';
import { IBodyCreatePlanos } from '../../shared/interfaces/planos/interfaces';

export const create = async (plano: IBodyCreatePlanos, usuario: Usuario): Promise<number | Error> => {

    try {

        const newplano = planoRepository.create({
            conteudo: plano.conteudo,
            duracao: plano.duracao,
            nivel: plano.nivel,
            tema: plano.tema,
            usuario: usuario
        });

        const result = await planoRepository.save(newplano);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }
};