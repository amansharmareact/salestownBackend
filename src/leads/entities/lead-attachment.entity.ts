// src/leads/entities/lead-attachment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Lead } from './lead.entity';

@Entity()
export class LeadAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @ManyToOne(() => Lead, (lead) => lead.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column()
  lead_id: number;

  @CreateDateColumn()
  uploaded_at: Date;
}
