import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signup(name: string, email: string, password: string, role?: string): Promise<Omit<import("./user.entity").User, "password">>;
    getUserData(): {
        message: string;
    };
    deleteUser(id: number): Promise<string>;
    getAllUsers(): Promise<Omit<import("./user.entity").User, "password">[]>;
    getAllAdmins(): Promise<Omit<import("./user.entity").User, "password">[]>;
}
