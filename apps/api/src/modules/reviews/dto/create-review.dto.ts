export class CreateReviewDto {
  rating!: number;
  comment?: string;
  targetUserId!: string; // 🔥 koho hodnotím
}
