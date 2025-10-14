import { Injectable } from '@nestjs/common';
import { LoanService } from '../loan/loan.service';
import { DashboardData } from '../types';

@Injectable()
export class DashboardService {
  constructor(private loanService: LoanService) {}

  async getDashboardData(): Promise<DashboardData> {
    const stats = await this.loanService.getStatistics();

    return {
      totalLoans: stats.totalLoans,
      totalLoanAmount: stats.totalLoanAmount,
      totalTokenized: stats.totalTokenized,
      totalTokenizedAmount: stats.totalTokenizedAmount,
      activeLoans: stats.activeLoans,
      expiredLoans: stats.expiredLoans,
    };
  }
}
