
import { deleteArquivoLocal } from '../../shared/services';
import { usuarioRepository } from '../../database/repositories';
import { FotosProvider } from '../fotos';

export const deleteById = async (id: number): Promise<void | Error> => {

    try {

        const usuario = await usuarioRepository.findOne({
            relations: {
                foto: true,
            },
            where: {
                id: id
            }
        });

        if (!usuario) {
            return new Error('Usuario não localizado');
        }

        if (usuario.foto) {

            const resultDeleteFoto = await deleteArquivoLocal(usuario.foto.local, usuario.foto.nome);

            if (resultDeleteFoto instanceof Error) {
                return new Error(resultDeleteFoto.message);
            }

            const foto = FotosProvider.deleteById(usuario.foto.id);

            if (foto instanceof Error) {
                return new Error(foto.message);
            }

            console.log('foto excluida com sucesso');
        }

        const deleteUsuario = await usuarioRepository.delete({ id: id });

        if (deleteUsuario instanceof Error) {
            return new Error(deleteUsuario.message);
        }
        
        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};