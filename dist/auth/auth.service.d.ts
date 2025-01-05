import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { ResetToken } from "./reset-token.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private readonly resetTokenRepository;
    private readonly userService;
    private readonly jwtService;
    constructor(resetTokenRepository: Repository<ResetToken>, userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    forgotPassword(email: string): Promise<{
        reset_token: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
