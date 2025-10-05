import { Injectable } from '@nestjs/common';
import { Loan, CsvRow, UploadFile } from '../types';
import * as Papa from 'papaparse';

@Injectable()
export class LoanService {
  private loans: Loan[] = [];

  async uploadCsv(file: UploadFile): Promise<{ count: number }> {
    const csvData = file.buffer.toString('utf-8');

    return new Promise((resolve, reject) => {
      // Papa.parse is the function of the PapaParse library.
      // It can parse a CSV string into an array of JavaScript objects.
      Papa.parse<CsvRow>(csvData, {
        header: true,
        skipEmptyLines: true,
        // when parsing is successful
        complete: (results) => {
          const newLoans: Loan[] = results.data.map((row) => ({
            id: row.loan_id || row.id || '',
            status:
              row.status?.toUpperCase() === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE',
            // Use the value of row.amount if it exists; otherwise, use 0.
            // Convert the result to a string, and then convert that string into an actual floating-point number.
            amount: parseFloat(String(row.amount || 0)),
            // Snake_case/camelCase compatibility
            paymentSchedule: row.payment_schedule || row.paymentSchedule || '',
            interestRate: parseFloat(
              String(row.interest_rate || row.interestRate || 0),
            ),
            ltv: row.ltv ? parseFloat(String(row.ltv)) : undefined,
            riskGroup: row.risk_group || row.riskGroup || '',
            agreementUrl: row.agreement_url || row.agreementUrl || '',
            tokenized: false,
          }));

          this.loans.push(...newLoans);
          resolve({ count: newLoans.length });
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  findAll(): Loan[] {
    return this.loans;
  }

  findOne(id: string): Loan | undefined {
    return this.loans.find((loan) => loan.id === id);
  }

  tokenize(loanId: string): Loan | null {
    const loan = this.loans.find((l) => l.id === loanId);
    if (loan) {
      loan.tokenized = true;
      return loan;
    }
    return null;
  }

  updateLoanStatuses(): void {
    this.loans.forEach((loan) => {
      if (Math.random() > 0.9 && loan.status === 'ACTIVE') {
        loan.status = 'EXPIRED';
      }
    });
  }
}
