// custom-column.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Activity } from './activity.entity';

@Entity('custom_columns')
export class CustomColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  type: string; // Text, Dropdown, etc.

  @Column()
  options: string; // Comma-separated values for dropdown options

  @Column({ default: false })
  isRequired: boolean; // 0 = Optional, 1 = Required

  @Column({ default: true })
  isActive: boolean; // Default to true (active)
}

{/**
     // One custom column can be related to many activities
    @ManyToOne(() => Activity, (activity) => activity.customColumns)
    activity: Activity; */}