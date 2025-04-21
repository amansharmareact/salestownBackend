import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Pipeline } from './pipeline.entity';
import { Lead } from 'src/leads/entities/lead.entity';

@Entity()
export class PipelineStage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.pipestages, {
    onDelete: 'CASCADE',
  })
  pipeline: Pipeline;

  @OneToMany(() => Lead, (lead) => lead.pipelineStage)
  leads: Lead[];
}
