import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET, // Ensure JWT_SECRET is correctly configured
    });
  }

  async validate(payload: any) {
    // Ensure that the payload has the necessary fields
    if (!payload || !payload.sub || !payload.email) {
      throw new Error("Invalid token payload");
    }
    console.log(payload, "payload");
    return { userId: payload.sub, email: payload.email, role: payload.role }; // Attach these to req.user
  }
}
