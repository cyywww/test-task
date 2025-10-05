import { Injectable } from '@nestjs/common';
import { LoanService } from '../loan/loan.service';
import { DashboardData } from '../types';

@Injectable()
export class DashboardService {
  constructor(private loanService: LoanService) {}

  getDashboardData(): DashboardData {
    const loans = this.loanService.findAll();

    // Calculate the total loan amount
    const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    // Filter tokenized loans
    const tokenizedLoans = loans.filter((loan) => loan.tokenized);
    // Calculate the total amount of tokenized loans
    const totalTokenizedAmount = tokenizedLoans.reduce(
      (sum, loan) => sum + loan.amount,
      0,
    );
    const activeLoans = loans.filter((loan) => loan.status === 'ACTIVE').length;
    const expiredLoans = loans.filter(
      (loan) => loan.status === 'EXPIRED',
    ).length;

    return {
      totalLoans: loans.length,
      totalLoanAmount,
      totalTokenized: tokenizedLoans.length,
      totalTokenizedAmount,
      activeLoans,
      expiredLoans,
    };
  }
}
