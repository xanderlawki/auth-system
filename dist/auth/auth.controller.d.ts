import { AuthService } from "./auth.service";
interface AuthenticatedUser {
    id: number;
    email: string;
    role: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: {
        user: AuthenticatedUser;
    }): Promise<{
        access_token: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        reset_token?: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
export {};
