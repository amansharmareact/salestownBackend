import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Lead } from 'src/leads/entities/lead.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('uuid', { nullable: true })
  customer_id: string | null; // Make customer_id nullable

  @Column('uuid', { nullable: true })
  company_id: string;

  @Column('uuid', { nullable: true })
  currency_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  role: string;

  @Column()
  image: string;

  @Column()
  companyName: string;

  @Column()
  countryName: string;

  @Column()
  currencyName: string;

  @Column()
  day_left: number;

  @Column({ type: 'text', nullable: true })
  token: string | null;

  @Column({ nullable: true, type: 'varchar' })
  otp: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiry: Date | null;

  @Column({ default: true })
  can_change_password: boolean;
  organizationsAdded: any;
  id: any;
  timezone: string;
  financial_year: string;
  role_id: number;
  currency_icon: any;
  currency_unicode: any;
  currency_name: any;
  created_at: any;
  updated_at: any;
  followers: any;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => Lead, (lead) => lead.created_by)
  leads: Lead[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
