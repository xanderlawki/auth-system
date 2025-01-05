import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";

import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { ResetToken } from "src/auth/reset-token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetToken])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
