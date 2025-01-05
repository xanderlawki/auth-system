import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

describe("UserService", () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockResolvedValue({}),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
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

      // Mock bcrypt.hash with explicit type
      jest.spyOn(bcrypt, "hash").mockImplementation(async () => hashedPassword);

      jest.spyOn(mockUserRepository, "create").mockReturnValue({
        id: 1,
        ...userDto,
        password: hashedPassword,
      });

      jest.spyOn(mockUserRepository, "save").mockResolvedValue({
        id: 1,
        ...userDto,
        password: hashedPassword,
      });

      const result = await userService.createUser(
        userDto.name,
        userDto.email,
        userDto.password,
        userDto.role
      );

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
