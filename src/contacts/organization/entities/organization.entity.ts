// src/organization/entities/organization.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ type: 'int', nullable: true })
  owner: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
