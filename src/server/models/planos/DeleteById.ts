
import { planoRepository } from '../../database/repositories/planoRepository';

export const deleteById = async (id: number): Promise<void | Error> => {

    try {

        const usuario = await planoRepository.findOne({
            where: {
                id: id
            }
        });

        if (!usuario) {
            return new Error('Plano não localizado');
        }

        const deletePlano = await planoRepository.delete({ id: id });

        if (deletePlano instanceof Error) {
            return new Error(deletePlano.message);
        }
        
        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};