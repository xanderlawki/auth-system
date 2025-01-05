import { Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { LocalAuthGuard } from "./local.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ResetToken } from "./reset-token.entity";
import { MiddlewareConsumer } from "@nestjs/common";
import { rateLimiter } from "src/middleware/rate-limit.middleware";
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRY") || "1h",
        },
      }),
    }),
    TypeOrmModule.forFeature([ResetToken]),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, LocalAuthGuard],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(rateLimiter) // Apply rate limiter middleware

      .forRoutes(
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/reset-password", method: RequestMethod.POST },
      );
  }
}
