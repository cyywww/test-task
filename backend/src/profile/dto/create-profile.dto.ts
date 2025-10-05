export class CreateProfileDto {
  name: string;
  country: string;
  foundingYear: number;
  totalPortfolio: number;
  creditRiskScore: number;
  productType: 'Mortgage' | 'Private' | 'Business';
  websiteUrl: string;
  contacts: string;
}
