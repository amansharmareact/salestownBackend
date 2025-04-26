import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';
import { Pipeline } from 'src/pipelines/entities/pipeline.entity';
import { PipelineStage } from 'src/pipelines/entities/pipeline-stage.entity';
import { LeadAttachment } from './lead-attachment.entity';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  lead_id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @ManyToOne(() => Organization, (organization) => organization.leads)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  organization_id: string;

  @ManyToOne(() => Person, (person) => person.leads)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column()
  person_id: string;

  @Column()
  title: string;

  @Column('decimal')
  value: number;

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.leads)
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: Pipeline;

  @Column()
  pipeline_id: number;

  @ManyToOne(() => PipelineStage, (stage) => stage.leads)
  @JoinColumn({ name: 'pipestage_id' })
  pipelineStage: PipelineStage;

  @Column()
  pipestage_id: number;

  @Column('date')
  expected_close_date: string;

  @Column()
  can_view: number;

  @Column('text', { array: true, nullable: true })
  email: string[];

  @Column('text', { array: true, nullable: true })
  phone: string[];

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column('integer')
  pincode: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  address_line_2: string;

  @Column('json', { nullable: true })
  custom_field_value: any[];

  @Column('json', { nullable: true })
  custom_column_id: any[];

  @ManyToOne(() => User, (user) => user.leads)
  @JoinColumn({ name: 'created_by_user_id' }) // This maps to column
  created_by: User;

  @Column()
  created_by_user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  salesperson: string;

  @OneToMany(() => LeadAttachment, (attachment) => attachment.lead)
  attachments: LeadAttachment[];

  // These Columns are for Lead Won
  @Column({ default: false })
  is_won: boolean;

  @Column({ default: 0 })
  submit_value: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 0 })
  won_value: number;

  @Column('text', { array: true, default: [] })
  won_check: string[];

  //These colums are for Lead Lost

  @Column({ default: false })
  is_lost: boolean;

  @Column({ nullable: true })
  lost_reason_id: number; //

  @Column({ nullable: true })
  lost_reason: string; //

  @Column({ nullable: true })
  comment: string;

  @UpdateDateColumn()
  updated_at: Date;
  source: any;
  won_probability: string;
  ownerName: any;
  lead_activity_flag: null;
  tag_color_code: any;
  tag_color: any;
  tag_name: any;
}


