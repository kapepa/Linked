import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Feet} from "../feet/feet.entity";
import {Role} from "../auth/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  avatar: string

  @Column({ type: "enum", enum: Role, default: Role.User})
  role: Role;

  @OneToMany(() => Feet, (feet) => feet.author)
  feet: Feet[];

  @CreateDateColumn({ name: 'created_at'})
  created_at: Date;
}