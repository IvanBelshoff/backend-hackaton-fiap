import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Foto } from "./Fotos";
import { Plano } from ".";

export enum TipoUsuario {
    PRO = 'professor',
    ADM = 'administrador',
}

@Entity("usuarios")
export class Usuario {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'text', nullable: false })
    nome: string

    @Column({ type: 'text', nullable: false })
    sobrenome: string

    @Column({ type: 'text', nullable: false, unique: true })
    email: string

    @Column({ default: false })
    bloqueado: boolean
    
    @Column({ nullable: false, type: 'enum', enum: TipoUsuario, default: TipoUsuario.PRO })
    tipo_usuario: TipoUsuario;

    @Column()
    senha?: string;

    @Column({ type: 'text', nullable: true })
    usuario_atualizador?: string;

    @Column({ type: 'text', nullable: true })
    usuario_cadastrador?: string;

    @Column({ nullable: true, type: "timestamp" }) // Alteração do tipo para timestamp
    ultimo_login?: Date

    @CreateDateColumn({ nullable: false, type: "timestamp" }) // Alteração do tipo para timestamp
    data_criacao: Date

    @UpdateDateColumn({ nullable: false, type: "timestamp" }) // Alteração do tipo para timestamp
    data_atualizacao: Date

    @OneToOne(() => Foto, (foto) => foto.usuario, {
        cascade: true,
        onDelete: 'CASCADE'
    })

    @JoinColumn({ name: "foto_id" })
    foto: Foto
    
    @OneToMany(() => Plano, (plano) => plano.usuario)
    planos: Plano[]

}
