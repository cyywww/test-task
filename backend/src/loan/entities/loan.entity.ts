import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('loans')
export class Loan {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'EXPIRED';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  paymentSchedule: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interestRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ltv: number | null;

  @Column({ type: 'varchar', length: 10 })
  riskGroup: string;

  @Column({ type: 'varchar', length: 500 })
  agreementUrl: string;

  @Column({ type: 'boolean', default: false })
  tokenized: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
