import { usuarioRepository } from '../../database/repositories';

import { FotosProvider } from '../fotos';
import { Foto } from '../../database/entities';
import { PasswordCrypto } from '../../shared/services';
import { IBodyUpdateByIdUsuarios } from '../../shared/interfaces';

export const updateById = async (id: number, usuario: IBodyUpdateByIdUsuarios, foto?: Omit<Foto, 'id' | 'data_atualizacao' | 'data_criacao' | 'usuario' | 'url'>): Promise<void | Error> => {

    try {

        if (foto) {
            const updateFoto = FotosProvider.updateById(id, 'atualizar', foto);

            if (updateFoto instanceof Error) {
                return new Error(updateFoto.message);
            }
        }

        const usuarioCadastrado = await usuarioRepository.findOne({
            where: {
                id: id
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Funcionario não localizado');
        }

        if (usuario.senha) {
            const senhaHash = await PasswordCrypto.hashPassword(usuario.senha);
            usuarioCadastrado.senha = senhaHash;
        }

        const {
            bloqueado = usuario.bloqueado || usuarioCadastrado.bloqueado,
            email = usuario.email || usuarioCadastrado.email,
            nome = usuario.nome || usuarioCadastrado.nome,
            sobrenome = usuario.sobrenome || usuarioCadastrado.sobrenome,
            usuario_atualizador = usuario.usuario_atualizador || usuarioCadastrado.usuario_atualizador
        } = usuario;

        usuarioCadastrado.nome = nome,
        usuarioCadastrado.sobrenome = sobrenome,
        usuarioCadastrado.email = email,
        usuarioCadastrado.bloqueado = String(bloqueado) == 'false' ? false : true,
        usuarioCadastrado.usuario_atualizador = usuario_atualizador;

        const atualizaUsuario = await usuarioRepository.save(usuarioCadastrado);

        if (atualizaUsuario instanceof Error) {
            return new Error(atualizaUsuario.message);
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};