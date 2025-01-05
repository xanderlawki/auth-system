import { User } from "../user/user.entity";
export declare class ResetToken {
    id: number;
    user: User;
    token: string;
    expires_at: Date;
}
