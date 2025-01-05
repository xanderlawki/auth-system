import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ResetToken } from "src/auth/reset-token.entity";
export declare class UserService {
    private readonly userRepository;
    private readonly resetTokenRepository;
    constructor(userRepository: Repository<User>, resetTokenRepository: Repository<ResetToken>);
    findByEmail(email: string): Promise<User | null>;
    createUser(name: string, email: string, password: string, role?: string): Promise<Omit<User, "password">>;
    updatePassword(userId: number, newPassword: string): Promise<void>;
    findById(id: number): Promise<User | null>;
    findAllUsers(): Promise<Omit<User, "password">[]>;
    findAllAdmins(): Promise<Omit<User, "password">[]>;
    deleteUser(id: number): Promise<string>;
}
