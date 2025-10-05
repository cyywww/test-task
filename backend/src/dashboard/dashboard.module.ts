import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { LoanModule } from '../loan/loan.module';

@Module({
  imports: [LoanModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
