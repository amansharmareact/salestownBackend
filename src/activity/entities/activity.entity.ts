import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ActivityPurpose } from './activity-purpose.entity';
import { User } from 'src/auth/entities/user.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';
import { ActivityType } from './activity-type.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  acitivity_id: number;

  @Column()
  activity_title: string;

  @Column()
  date: string;

  @Column()
  from_time: string;

  @Column()
  to_time: string;

  @Column({ nullable: true })
  activity_note: string;

  @Column({ default: 0 })
  mark_done: number;

  @Column({ nullable: true })
  report: string;

  @ManyToOne(() => ActivityPurpose)
  @JoinColumn({ name: 'purpose_id' })
  purpose: ActivityPurpose;

  @ManyToOne(() => ActivityType)
  @JoinColumn({ name: 'type_id' })
  type: ActivityType;

  @ManyToOne(() => User)
@JoinColumn({ name: 'owner_id' })
owner: User;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @CreateDateColumn({ type: 'timestamp' })
created_at: Date;

@Column({ type: 'timestamp', nullable: true })
completed_at: Date;

@Column('text', { array: true, nullable: true })
custom_field_value: string[];

@Column('int', { array: true, nullable: true })
custom_column_id: number[];

  @Column({ nullable: true })
  updated_at: Date;
  
}



{/***
  @OneToMany(() => CustomColumn, (customColumn) => customColumn.activity)
  customColumns: CustomColumn[]; */}
