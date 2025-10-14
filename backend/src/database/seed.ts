import { DataSource } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { Loan } from '../loan/entities/loan.entity';
import { getDatabaseConfig } from '../config/database.config';

async function seed() {
  const config = getDatabaseConfig();
  const dataSource = new DataSource({
    ...config,
    entities: [Profile, Loan],
  } as any);

  await dataSource.initialize();
  console.log('Database connected');

  try {
    // clear existing data (optional)
    // await dataSource.getRepository(Loan).clear();
    // await dataSource.getRepository(Profile).clear();

    // create sample Profile
    const profileRepo = dataSource.getRepository(Profile);
    const existingProfiles = await profileRepo.count();

    if (existingProfiles === 0) {
      const sampleProfiles = [
        {
          name: 'Nordic Credit Bank',
          country: 'Sweden',
          foundingYear: 2015,
          totalPortfolio: 5000000,
          creditRiskScore: 85.5,
          productType: 'Mortgage' as const,
          websiteUrl: 'https://nordiccredit.se',
          contacts: 'info@nordiccredit.se, +46 8 123 4567',
        },
        {
          name: 'Stockholm Financial Group',
          country: 'Sweden',
          foundingYear: 2010,
          totalPortfolio: 12000000,
          creditRiskScore: 92.3,
          productType: 'Business' as const,
          websiteUrl: 'https://stockholmfg.com',
          contacts: 'contact@stockholmfg.com, +46 8 765 4321',
        },
      ];

      await profileRepo.save(sampleProfiles);
      console.log('Created 2 sample profiles');
    }

    // create sample Loans
    const loanRepo = dataSource.getRepository(Loan);
    const existingLoans = await loanRepo.count();

    if (existingLoans === 0) {
      const sampleLoans: Array<Omit<Loan, 'createdAt' | 'updatedAt'>> = [];

      for (let i = 1; i <= 20; i++) {
        sampleLoans.push({
          id: `LOAN${String(i).padStart(3, '0')}`,
          status: i % 5 === 0 ? 'EXPIRED' : 'ACTIVE',
          amount: Math.floor(Math.random() * 90000) + 10000,
          paymentSchedule: ['monthly', 'quarterly', 'annually'][i % 3],
          interestRate: parseFloat((Math.random() * 5 + 2).toFixed(2)),
          ltv:
            i % 2 === 0
              ? parseFloat((Math.random() * 30 + 60).toFixed(2))
              : null,
          riskGroup: ['A', 'B', 'C'][i % 3],
          agreementUrl: `https://example.com/agreements/loan${i}`,
          tokenized: i % 7 === 0,
        });
      }

      await loanRepo.save(sampleLoans);
      console.log('Created 20 sample loans');
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
