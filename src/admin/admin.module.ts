import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { ResetToken } from "src/auth/reset-token.entity";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetToken]), UserModule],
  controllers: [AdminController], // Register AdminController
  providers: [UserService],
})
export class AdminModule {}
