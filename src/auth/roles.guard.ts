import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    console.log("User object in requiredRoles:", requiredRoles);
    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log("User object in RolesGuard:", user); // Debug user object

    if (!user || !user.role) {
      console.error("User role is missing"); // Log the error
      return false; // Deny access if user or role is missing
    }

    return requiredRoles.includes(user.role); // Check if user's role matches required roles
  }
}
