import { ResetToken } from "src/auth/reset-token.entity";
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    role: string;
    resetTokens: ResetToken[];
}
