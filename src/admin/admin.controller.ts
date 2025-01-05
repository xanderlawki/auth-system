import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UserService } from "../user/user.service";
import { JwtAuthGuard } from "src/auth/jwt.guard";
@Controller("admin")
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async createAdmin(
    @Body("name") name: string,
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    return this.userService.createUser(name, email, password, "admin"); // Set role as admin
  }
}
