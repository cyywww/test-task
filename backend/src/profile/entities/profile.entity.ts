import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'int' })
  foundingYear: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPortfolio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  creditRiskScore: number;

  @Column({
    type: 'enum',
    enum: ['Mortgage', 'Private', 'Business'],
  })
  productType: 'Mortgage' | 'Private' | 'Business';

  @Column({ type: 'varchar', length: 500 })
  websiteUrl: string;

  @Column({ type: 'text' })
  contacts: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
