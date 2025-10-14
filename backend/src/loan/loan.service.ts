import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CsvRow, UploadFile } from '../types';
import * as Papa from 'papaparse';
interface SumResult {
  sum: string | null;
}

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  async uploadCsv(file: UploadFile): Promise<{ count: number }> {
    const csvData = file.buffer.toString('utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse<CsvRow>(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          this.processCsvResults(results.data)
            .then((count) => {
              resolve({ count });
            })
            .catch((error) => {
              reject(error instanceof Error ? error : new Error(String(error)));
            });
        },
        error: (error: Error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        },
      });
    });
  }

  private async processCsvResults(data: CsvRow[]): Promise<number> {
    const loansToImport: Loan[] = data.map((row) => {
      const loan = new Loan();
      loan.id = row.loan_id || row.id || '';
      loan.status =
        row.status?.toUpperCase() === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE';
      loan.amount = parseFloat(String(row.amount || 0));
      loan.paymentSchedule = row.payment_schedule || row.paymentSchedule || '';
      loan.interestRate = parseFloat(
        String(row.interest_rate || row.interestRate || 0),
      );

      loan.ltv = row.ltv ? parseFloat(String(row.ltv)) : null;

      loan.riskGroup = row.risk_group || row.riskGroup || '';
      loan.agreementUrl = row.agreement_url || row.agreementUrl || '';
      loan.tokenized = false;
      return loan;
    });

    const savedLoans = await this.loanRepository.save(loansToImport, {
      chunk: 100,
    });

    return savedLoans.length;
  }

  async findAll(): Promise<Loan[]> {
    return await this.loanRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return loan;
  }

  async tokenize(loanId: string): Promise<Loan> {
    const loan = await this.findOne(loanId);

    if (loan.tokenized) {
      throw new ConflictException(`Loan ${loanId} is already tokenized`);
    }

    if (loan.status !== 'ACTIVE') {
      throw new ConflictException(`Only ACTIVE loans can be tokenized`);
    }

    loan.tokenized = true;
    return await this.loanRepository.save(loan);
  }

  async updateLoanStatuses(): Promise<void> {
    // Randomly mark some ACTIVE loans as EXPIRED (for demonstration purposes).
    const activeLoans = await this.loanRepository.find({
      where: { status: 'ACTIVE' },
      take: 10,
    });

    for (const loan of activeLoans) {
      if (Math.random() > 0.9) {
        loan.status = 'EXPIRED';
        await this.loanRepository.save(loan);
      }
    }
  }

  // Batch query (for Dashboard)
  async getStatistics() {
    const [total, tokenized, active, expired] = await Promise.all([
      this.loanRepository.count(),
      this.loanRepository.count({ where: { tokenized: true } }),
      this.loanRepository.count({ where: { status: 'ACTIVE' } }),
      this.loanRepository.count({ where: { status: 'EXPIRED' } }),
    ]);

    const totalAmount = await this.loanRepository
      .createQueryBuilder('loan')
      .select('SUM(loan.amount)', 'sum')
      .getRawOne<SumResult>();

    const tokenizedAmount = await this.loanRepository
      .createQueryBuilder('loan')
      .select('SUM(loan.amount)', 'sum')
      .where('loan.tokenized = :tokenized', { tokenized: true })
      .getRawOne<SumResult>();

    return {
      totalLoans: total,
      totalTokenized: tokenized,
      activeLoans: active,
      expiredLoans: expired,
      totalLoanAmount: parseFloat(totalAmount?.sum || '0'),
      totalTokenizedAmount: parseFloat(tokenizedAmount?.sum || '0'),
    };
  }
}
