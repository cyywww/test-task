import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { LoanModule } from './loan/loan.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ProfileModule, LoanModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
