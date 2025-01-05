import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local.guard";

import { rateLimiter } from "src/middleware/rate-limit.middleware";
interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
}
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: { user: AuthenticatedUser }) {
    return this.authService.login(req.user);
  }

  @Post("forgot-password")
  async forgotPassword(
    @Body("email") email: string,
  ): Promise<{ message: string; reset_token?: string }> {
    const { reset_token } = await this.authService.forgotPassword(email);

    // In a real application, you'd email the token instead of returning it
    console.log(`Reset token for ${email}: ${reset_token}`);
    return {
      message: "Password reset link has been sent to your email.",
      reset_token,
    };
  }

  @Post("reset-password")
  async resetPassword(
    @Body("token") token: string,
    @Body("newPassword") newPassword: string,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, newPassword);
    return { message: "Password has been reset successfully." };
  }
}
