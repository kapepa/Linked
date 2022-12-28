import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Feet} from "./feet.entity";

@Entity()
export  class AdditionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Feet, (feet) => feet.addition)
  post?: Feet;

  @Column()
  jobTitle?: string;

  @Column()
  company?: string;

  @Column()
  placesWork?: string;

  @Column()
  region?: string;
}