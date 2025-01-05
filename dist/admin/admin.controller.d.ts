import { UserService } from "../user/user.service";
export declare class AdminController {
    private readonly userService;
    constructor(userService: UserService);
    createAdmin(name: string, email: string, password: string): Promise<Omit<import("../user/user.entity").User, "password">>;
}
