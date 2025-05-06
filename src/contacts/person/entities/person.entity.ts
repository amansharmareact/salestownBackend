// src/contacts/person/entities/person.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Note } from 'src/general/notes/entities/notes.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  person_name: string;

  @Column()
  organization_name: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  designation: string;

  @Column('text', { array: true, nullable: true })
  email: string[];

  @Column('text', { array: true, nullable: true })
  phone: string[];

  @Column('text', { array: true, nullable: true })
  custom_field_value: string[];

  @Column('int', { array: true, nullable: true })
  custom_column_id: number[];

  //@ManyToOne(() => Organization, (org) => org.id, { nullable: false })
  //organization: Organization;

  @ManyToOne(() => Organization, (organization) => organization.persons, {
    onDelete: 'CASCADE', // optional
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Lead, (lead) => lead.person)
  leads: Lead[];

  @Column()
  organization_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
    name: null;
    emails: never[];
    phones: never[];

    @OneToMany(() => Activity, (activity) => activity.person)
  activities: Activity[];

  @OneToMany(() => Note, (note) => note.person)
notes: Note[];

}
