import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import {Feet} from "../feet/feet.entity";
import {Role} from "../auth/role.enum";
import {FriendsEntity} from "../friends/friends.entity";

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
  avatar: string;

  @OneToMany(() => FriendsEntity, (friendsRequest) => friendsRequest.user)
  request: FriendsEntity[];

  @OneToMany(() => FriendsEntity, (friendsRequest) => friendsRequest.friends)
  suggest: FriendsEntity[];

  @ManyToMany(() => User,{cascade: true})
  @JoinTable({ name: 'user-friends' })
  friends: User[]

  @Column({ type: "enum", enum: Role, default: Role.User})
  role: Role;

  @OneToMany(() => Feet, (feet) => feet.author)
  feet: Feet[];

  @CreateDateColumn({ name: 'created_at'})
  created_at: Date;
}