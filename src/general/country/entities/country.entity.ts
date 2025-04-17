import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { State } from '../../state/entities/state.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phonecode: number;

  @Column()
  shortname: string;

  @Column()
  flag: string;

  @OneToMany(() => State, (state) => state.country)
  states: State[];

}
