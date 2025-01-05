"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
describe("UserService", () => {
    let userService;
    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue({}),
        save: jest.fn().mockResolvedValue({}),
        delete: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_service_1.UserService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();
        userService = module.get(user_service_1.UserService);
    });
    describe("createUser", () => {
        it("should create a new user", async () => {
            const userDto = {
                name: "Test User",
                email: "test@example.com",
                password: "password",
                role: "user",
            };
            const hashedPassword = "mocked_hashed_password";
            jest.spyOn(bcrypt, "hash").mockImplementation(async () => hashedPassword);
            jest.spyOn(mockUserRepository, "create").mockReturnValue(Object.assign(Object.assign({ id: 1 }, userDto), { password: hashedPassword }));
            jest.spyOn(mockUserRepository, "save").mockResolvedValue(Object.assign(Object.assign({ id: 1 }, userDto), { password: hashedPassword }));
            const result = await userService.createUser(userDto.name, userDto.email, userDto.password, userDto.role);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: userDto.name,
                email: userDto.email,
                password: hashedPassword,
                role: userDto.role,
            });
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(result).toEqual({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                role: "user",
            });
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map