import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Lead } from 'src/leads/entities/lead.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lead_id: number;

  @Column({ type: 'uuid', nullable: true })
  organization_id: string;

  @Column({ type: 'uuid', nullable: true })
  person_id: string;

  @Column({ type: 'text' })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Lead, (lead) => lead.notes, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @ManyToOne(() => Organization, (org) => org.notes, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Person, (person) => person.notes, { nullable: true })
  @JoinColumn({ name: 'person_id' })
  person: Person;
}

