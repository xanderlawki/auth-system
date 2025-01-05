"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const class_validator_1 = require("class-validator");
const reset_token_entity_1 = require("../auth/reset-token.entity");
let UserService = class UserService {
    constructor(userRepository, resetTokenRepository) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async createUser(name, email, password, role = "user") {
        if (!name || name.trim().length < 3) {
            throw new common_1.BadRequestException("Name must be at least 3 characters long.");
        }
        if (!email || !(0, class_validator_1.isEmail)(email)) {
            throw new common_1.BadRequestException("Invalid email format.");
        }
        if (!password || password.length < 6) {
            throw new common_1.BadRequestException("Password must be at least 6 characters long.");
        }
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException("A user with this email already exists.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = this.userRepository.create({
                name,
                email,
                password: hashedPassword,
                role,
            });
            const savedUser = await this.userRepository.save(user);
            const { password: _ } = savedUser, response = __rest(savedUser, ["password"]);
            return response;
        }
        catch (error) {
            if (error.code === "SQLITE_CONSTRAINT" &&
                error.message.includes("UNIQUE constraint failed: users.email")) {
                throw new common_1.BadRequestException("A user with this email already exists.");
            }
            throw error;
        }
    }
    async updatePassword(userId, newPassword) {
        await this.userRepository.update(userId, { password: newPassword });
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findAllUsers() {
        const users = await this.userRepository.find();
        return users.map((_a) => {
            var { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        });
    }
    async findAllAdmins() {
        const admins = await this.userRepository.find({ where: { role: "admin" } });
        return admins.map((_a) => {
            var { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        });
    }
    async deleteUser(id) {
        await this.resetTokenRepository.delete({ user: { id } });
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error("User not found");
        }
        await this.userRepository.delete(id);
        return `User with ID ${id} has been deleted successfully.`;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(reset_token_entity_1.ResetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map