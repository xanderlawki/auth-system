"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const bcrypt = require("bcrypt");
describe("UserController", () => {
    let userController;
    let userService;
    const mockUserService = {
        createUser: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_controller_1.UserController],
            providers: [
                {
                    provide: user_service_1.UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();
        userController = module.get(user_controller_1.UserController);
        userService = module.get(user_service_1.UserService);
    });
    describe("signup", () => {
        it("should sign up a new user", async () => {
            const userDto = {
                name: "Test User",
                email: "test@example.com",
                password: "password",
                role: "user",
            };
            const hashedPassword = await bcrypt.hash(userDto.password, 10);
            mockUserService.createUser.mockResolvedValue({
                id: 1,
                name: userDto.name,
                email: userDto.email,
                password: hashedPassword,
                role: userDto.role,
            });
            const result = await userController.signup(userDto.name, userDto.email, userDto.password, userDto.role);
            expect(mockUserService.createUser).toHaveBeenCalledWith(userDto.name, userDto.email, userDto.password, userDto.role);
            expect(result).toEqual({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                password: hashedPassword,
                role: userDto.role,
            });
        });
        it("should throw ForbiddenException when trying to create an admin user", async () => {
            const adminUserDto = {
                name: "Admin User",
                email: "admin@example.com",
                password: "password",
                role: "admin",
            };
            await expect(userController.signup(adminUserDto.name, adminUserDto.email, adminUserDto.password, adminUserDto.role)).rejects.toThrow("Only existing admins can create new admins.");
        });
    });
});
//# sourceMappingURL=user.controller.spec.js.map