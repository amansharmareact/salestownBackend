import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activity_types')
export class ActivityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
}
