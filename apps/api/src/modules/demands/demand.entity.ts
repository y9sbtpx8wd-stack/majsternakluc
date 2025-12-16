import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('demands')
export class Demand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'text' })
  content!: string;

  @Column()
  location!: string;

  @Column({ nullable: true })
  offeredPrice?: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ default: 0 })
  views!: number;
}
