import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';

@Entity('activity_purposes')
export class ActivityPurpose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  purpose: string;

  
  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Activity, (activity) => activity.purpose)
  activities: Activity[];
}
