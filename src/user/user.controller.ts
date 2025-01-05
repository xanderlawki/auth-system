import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Get, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { JwtAuthGuard } from "src/auth/jwt.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  async signup(
    @Body("name") name: string,
    @Body("email") email: string,
    @Body("password") password: string,
    @Body("role") role: string = "user"
  ) {
    if (role === "admin") {
      throw new ForbiddenException(
        "Only existing admins can create new admins."
      );
    }

    return this.userService.createUser(name, email, password, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("user", "admin") // Allow both 'user' and 'admin' roles
  @Get()
  getUserData() {
    return { message: "This is accessible by both users and admins" };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin") // Restrict this route to admins only
  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    const user = await this.userService.findById(id);
    console.log(user, "user");
    if (!user) {
      throw new ForbiddenException("User not found");
    }

    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin") // Restrict to admin
  @Get("all-users")
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin") // Restrict to admin
  @Get("all-admins")
  async getAllAdmins() {
    return this.userService.findAllAdmins();
  }
}
