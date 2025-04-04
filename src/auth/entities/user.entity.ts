import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @PrimaryGeneratedColumn('uuid')
  company_id: string;

  @PrimaryGeneratedColumn('uuid')
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

  @Column({ nullable: true, type: 'varchar' }) // ✅ Allowing null
  otp: string | null;

  @Column({ nullable: true, type: 'timestamp' }) // ✅ Allowing null
  otpExpiry: Date | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
