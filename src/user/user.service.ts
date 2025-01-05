import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { isEmail } from "class-validator";
import { ResetToken } from "src/auth/reset-token.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>
  ) {}

  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Create a new user with input validation and error handling
  async createUser(
    name: string,
    email: string,
    password: string,
    role: string = "user" // Default role is 'user'
  ): Promise<Omit<User, "password">> {
    // Validate input
    if (!name || name.trim().length < 3) {
      throw new BadRequestException("Name must be at least 3 characters long.");
    }

    if (!email || !isEmail(email)) {
      throw new BadRequestException("Invalid email format.");
    }

    if (!password || password.length < 6) {
      throw new BadRequestException(
        "Password must be at least 6 characters long."
      );
    }

    // Check for duplicate email
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("A user with this email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and handle database constraint errors
    try {
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const savedUser = await this.userRepository.save(user);

      // Exclude password before returning
      const { password: _, ...response } = savedUser;
      return response;
    } catch (error: any) {
      if (
        error.code === "SQLITE_CONSTRAINT" &&
        error.message.includes("UNIQUE constraint failed: users.email")
      ) {
        throw new BadRequestException("A user with this email already exists.");
      }
      throw error;
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: newPassword });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAllUsers(): Promise<Omit<User, "password">[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest); // Exclude password
  }

  async findAllAdmins(): Promise<Omit<User, "password">[]> {
    const admins = await this.userRepository.find({ where: { role: "admin" } });
    return admins.map(({ password, ...rest }) => rest); // Exclude password
  }

  async deleteUser(id: number): Promise<string> {
    // Delete dependent records (e.g., reset tokens)
    await this.resetTokenRepository.delete({ user: { id } });
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(id);
    return `User with ID ${id} has been deleted successfully.`;
  }
}
