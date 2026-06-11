import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './user_status.enum';

@Entity('blog.users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 55 })
  name!: string;

  @Column({ length: 100 })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  create_time!: Date;

  // ----------------------------
  // 自动加密密码
  // ----------------------------
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // 如果密码没有被修改，则跳过
    if (!this.password) return;

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  // ----------------------------
  // 验证密码
  // ----------------------------
  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}