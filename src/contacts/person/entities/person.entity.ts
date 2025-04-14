// src/contacts/person/entities/person.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Organization } from 'src/contacts/organization/entities/organization.entity';

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

  @Column()
  organization_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
