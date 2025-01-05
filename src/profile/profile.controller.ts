import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { UserService } from "../user/user.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req: any) {
    const user = await this.userService.findByEmail(req.user.email); // Fetch user from DB
    if (!user) {
      throw new Error("User not found in database");
    }
    return {
      email: user.email,
      name: user.name,
    };
  }
}
