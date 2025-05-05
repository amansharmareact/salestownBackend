// src/product/entities/product.entity.ts

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Category } from './category.entity';
  @Entity()
  export class Product {
    @PrimaryGeneratedColumn()
    product_id: number;
  
    @Column()
    product_name: string;
  
    @Column()
    product_code: string;
  
    @Column({ nullable: true })
    unit: string;
  
    @Column({ nullable: true, type: 'float' })
    unit_price: number;
  
    @Column({ nullable: true, type: 'float' })
    tax: number;
  
    @Column({ nullable: true, type: 'int' })
    stock: number;
  
    @Column({ nullable: true, type: 'text' })
    description: string;
  
    @Column({ nullable: true })
    thumbnail: string;
  
    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;
    
    @Column({ nullable: true })
    category_id: number;

    @Column('text', { array: true, nullable: true })
    custom_field_value: string[];

    @Column('int', { array: true, nullable: true })
    custom_column_id: number[];

    @CreateDateColumn({ type: 'timestamp' })
   created_at: Date;

  }
  