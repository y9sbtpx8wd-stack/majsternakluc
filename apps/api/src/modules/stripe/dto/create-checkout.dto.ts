export class CreateCheckoutDto {
  userId: string;
  amount: number;
  period: 'month' | 'year';
}
