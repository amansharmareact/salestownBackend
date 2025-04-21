import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PipelineStage } from './pipeline-stage.entity';
import { Lead } from 'src/leads/entities/lead.entity';

@Entity()
export class Pipeline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PipelineStage, (stage) => stage.pipeline, { cascade: true })
  pipestages: PipelineStage[]; 

  @OneToMany(() => Lead, (lead) => lead.pipeline)
leads: Lead[];


}
