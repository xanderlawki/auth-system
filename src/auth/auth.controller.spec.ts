import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("login", () => {
    it("should return an access token", async () => {
      const loginDto = {
        id: 1, // Add the id
        email: "test@example.com",
        password: "password",
        role: "user", // Add the role
      };
      const result = { access_token: "jwt-token" };

      jest.spyOn(authService, "login").mockResolvedValue(result);

      expect(await authController.login({ user: loginDto })).toEqual(result);
    });
  });
});
