import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity("reset_tokens")
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.resetTokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" }) // Maps the foreign key column
  user: User;

  @Column()
  token: string;

  @Column({ type: "datetime" })
  expires_at: Date;
}
