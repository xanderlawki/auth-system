import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { UserModule } from "../user/user.module"; // Import the module containing UserService

@Module({
  imports: [UserModule], // Add UserModule here
  controllers: [ProfileController],
})
export class ProfileModule {}
