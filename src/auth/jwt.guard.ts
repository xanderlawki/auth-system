import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    console.log("User in JwtAuthGuard:", user); // Debugging user object
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
