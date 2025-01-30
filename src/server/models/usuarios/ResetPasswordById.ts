import { usuarioRepository } from '../../database/repositories';
import { PasswordCrypto } from '../../shared/services';


export const resetPasswordById = async (id: number, senha: string): Promise<void | Error> => {

    try {

        const usuarioCadastrado = await usuarioRepository.findOne({
            relations: {
                foto: true
            },
            where: {
                id: id
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Usuário não localizado');
        }

        const senhaHash = await PasswordCrypto.hashPassword(senha);

        usuarioCadastrado.senha = senhaHash;

        const update = await usuarioRepository.save(usuarioCadastrado);

        if (update) {
            return;
        }

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};