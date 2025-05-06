

import { Activity } from 'src/activity/entities/activity.entity';
import { User } from 'src/auth/entities/user.entity';
import { Person } from 'src/contacts/person/entities/person.entity';
import { Note } from 'src/general/notes/entities/notes.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organization_name: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, type: 'int' })
  pincode: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  address_line_2: string;

  @Column({ nullable: true })
  gst: string;

  @Column({ nullable: true })
  pan: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  twitter: string;

  @Column('text', { array: true, nullable: true })
  custom_field_value: string[];

  @Column('int', { array: true, nullable: true })
  custom_column_id: number[];

  @Column({ type: 'int', array: true, nullable: true })
  custom_column_value_id: number[];

  @Column({ type: 'uuid', nullable: true })
  owner: string;

  @OneToMany(() => Person, (person) => person.organization)
  persons: Person[];

  @OneToMany(() => Lead, (lead) => lead.organization)
  leads: Lead[];

 
  @OneToMany(() => Activity, (activity) => activity.organization)
  activities: Activity[];

  @OneToMany(() => Note, (note) => note.organization)
notes: Note[];


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
    name: null;
}
