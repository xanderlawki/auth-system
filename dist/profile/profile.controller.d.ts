import { UserService } from "../user/user.service";
export declare class ProfileController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<{
        email: string;
        name: string;
    }>;
}
