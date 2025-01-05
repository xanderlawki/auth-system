"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
describe("AuthController", () => {
    let authController;
    let authService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: {
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();
        authController = module.get(auth_controller_1.AuthController);
        authService = module.get(auth_service_1.AuthService);
    });
    describe("login", () => {
        it("should return an access token", async () => {
            const loginDto = {
                id: 1,
                email: "test@example.com",
                password: "password",
                role: "user",
            };
            const result = { access_token: "jwt-token" };
            jest.spyOn(authService, "login").mockResolvedValue(result);
            expect(await authController.login({ user: loginDto })).toEqual(result);
        });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map