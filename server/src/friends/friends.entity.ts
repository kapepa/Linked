import {CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import {User} from "../users/users.entity";

export enum Status {
  PENDING = "pending",
  OVERRIDE = "override",
  ACCEPTED = "accepted",
}

@Entity()
export class FriendsEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.request)
  user: User

  @ManyToOne(() => User, (user) => user.suggest)
  friends: User

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  status: Status

  @CreateDateColumn({ select: false, name: 'created_at' })
  created_at: Date;
}