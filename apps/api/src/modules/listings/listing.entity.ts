import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  owner!: User;

  @Column()
  title!: string; // profesia / zručnosť

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  pricePerHour?: string;

  @Column({ type: 'jsonb', nullable: true })
  photos?: string[]; // 3 fotky

  @Column({ default: 0 })
  views!: number;

  @Column({ default: 0 })
  phoneReveals!: number;

  @Column({ default: 0 })
  emailReveals!: number;
}
