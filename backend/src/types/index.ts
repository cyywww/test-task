export interface Profile {
  id: string;
  name: string;
  country: string;
  foundingYear: number;
  totalPortfolio: number;
  creditRiskScore: number;
  productType: 'Mortgage' | 'Private' | 'Business';
  websiteUrl: string;
  contacts: string;
}

export interface Loan {
  id: string;
  status: 'ACTIVE' | 'EXPIRED';
  amount: number;
  paymentSchedule: string;
  interestRate: number;
  ltv?: number;
  riskGroup: string;
  agreementUrl: string;
  tokenized: boolean;
}

export interface DashboardData {
  totalLoans: number;
  totalLoanAmount: number;
  totalTokenized: number;
  totalTokenizedAmount: number;
  activeLoans: number;
  expiredLoans: number;
}

export interface CsvRow {
  loan_id?: string;
  id?: string;
  status?: string;
  amount?: string | number;
  payment_schedule?: string;
  paymentSchedule?: string;
  interest_rate?: string | number;
  interestRate?: string | number;
  ltv?: string | number;
  risk_group?: string;
  riskGroup?: string;
  agreement_url?: string;
  agreementUrl?: string;
}

export interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  fieldname: string;
  encoding: string;
  size: number;
}
