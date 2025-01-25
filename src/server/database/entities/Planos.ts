import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Usuario } from "./Usuarios"


@Entity('planos')
export class Plano {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', nullable: false })
    tema: string

    @Column({ type: 'text', nullable: false })
    nivel: string

    @Column({ type: 'text', nullable: false })
    conteudo: string

    @Column({ type: "time" }) // Define o valor padrão como 07:00
    duracao: string;

    @CreateDateColumn({ nullable: false, type: "timestamp" }) // Alteração do tipo para timestamp
    data_criacao: Date

    @UpdateDateColumn({ nullable: false, type: "timestamp" }) // Alteração do tipo para timestamp
    data_atualizacao: Date

    @ManyToOne(() => Usuario, (usuario) => usuario.planos, { nullable: false })
    usuario: Usuario
}