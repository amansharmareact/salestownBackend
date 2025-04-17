
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Country } from '../../country/entities/country.entity';
import { City } from '../../city/entities/city.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Country, (country) => country.states)
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
