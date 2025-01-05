import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import * as bcrypt from "bcrypt";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
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

      const result = await userController.signup(
        userDto.name,
        userDto.email,
        userDto.password,
        userDto.role
      );

      expect(mockUserService.createUser).toHaveBeenCalledWith(
        userDto.name,
        userDto.email,
        userDto.password,
        userDto.role
      );

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

      await expect(
        userController.signup(
          adminUserDto.name,
          adminUserDto.email,
          adminUserDto.password,
          adminUserDto.role
        )
      ).rejects.toThrow("Only existing admins can create new admins.");
    });
  });
});
