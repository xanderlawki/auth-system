import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetToken } from "./reset-token.entity";
import { Repository } from "typeorm";
import * as moment from "moment";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const { password: _, ...result } = user; // Exclude password from the result
    return result;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException("User not found");
    const token = this.jwtService.sign(
      { email },
      { secret: process.env.JWT_SECRET, expiresIn: "15m" },
    );
    const expiresAt = moment().add(15, "minutes").toDate();

    await this.resetTokenRepository.save({
      user,
      token,
      expires_at: expiresAt,
    });

    return { reset_token: token };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload: any;

    try {
      // Verify the token
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired reset token.");
    }

    // Fetch the user by email
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.id, hashedPassword);
  }
}
