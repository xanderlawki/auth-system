# auth-system# JWT Authentication System

This project implements a secure and feature-rich authentication system using NestJS, JWT, SQLite, and TypeORM. It includes features such as user signup, login, role-based authentication, rate limiting, and password reset functionality.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [API Documentation](#api-documentation)
   - Endpoints
   - Request/Response Format
3. [Features](#features)
   - Role-Based Authentication
   - Rate Limiting
   - Password Reset
   - Admin-Specific Endpoints
4. [Assumptions and Limitations](#assumptions-and-limitations)
5. [Testing](#testing)
6. [Environment Variables](#environment-variables)

---

## Project Setup

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v16 or higher)
- Docker (for containerized deployment)
- SQLite3 (local database option)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE=auth_system.db
   JWT_SECRET=mysecretkey12345
   JWT_EXPIRATION=3600s
   ```

4. Run the application:

   ```bash
   npm run start:dev
   ```

5. Access the application at `http://localhost:3000`.

---

## API Documentation

### **Endpoints**

#### User Signup

- **URL:** `/user/signup`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "user" | "admin" (default: "user")
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
  ```

#### User Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt-token"
  }
  ```

#### Get User Profile

- **URL:** `/user/profile`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "email": "john@example.com",
    "name": "John Doe"
  }
  ```

#### Get All Users (Admin Only)

- **URL:** `/user/all-users`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    }
  ]
  ```

#### Delete User (Admin Only)

- **URL:** `/user/:id`
- **Method:** `DELETE`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User with ID 1 has been deleted successfully."
  }
  ```

---

## Features

### **1. Role-Based Authentication**

- Users are assigned roles (`user`, `admin`) during signup.
- Admin-only routes (e.g., viewing all users, deleting a user) are protected by a `RolesGuard`.
- Role-based access is managed via a custom decorator `@Roles()` and the `RolesGuard`.

### **2. Rate Limiting**

- Sensitive routes (e.g., login, password reset) are rate-limited using `express-rate-limit`.
- Limits are defined globally in the `middleware/rate-limit.middleware.ts` file.
- Example configuration:
  ```typescript
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Max 5 requests per minute
  });
  ```

### **3. Password Reset**

- A user can request a password reset via their email.
- The system generates a JWT-based reset token with a 15-minute expiration.
- Example Workflow:
  1. **Request Reset Token:** `/auth/forgot-password`
  2. **Reset Password:** `/auth/reset-password`

### **4. Admin-Specific Endpoints**

- Admins can:
  - View all users.
  - View all admins.
  - Delete users.

### **5. Input Validation**

- Inputs are validated using `class-validator` to ensure data integrity.
- Example validation:
  ```typescript
  if (!isEmail(email)) {
    throw new BadRequestException("Invalid email format.");
  }
  ```

### **6. Excluded Sensitive Data**

- Passwords are hashed using `bcrypt` and excluded from all API responses.

---

## Assumptions and Limitations

### **Assumptions**

- An admin must already exist to create another admin (using the user/signup).
- Tokens are signed using a static secret defined in the `.env` file.
- SQLite is used as the database for simplicity.

### **Limitations**

- No email service integration for sending password reset tokens.
- Rate limiting is global and not per-IP or per-user.
- Basic logging and error handling.

---

## Testing

### **Run Tests**

```bash
npm run test
```

### **Key Test Cases**

1. **Signup:** Ensure that user data is validated and saved correctly.
2. **Login:** Test token generation and user validation.
3. **Role-Based Access:** Validate admin-only endpoints.
4. **Rate Limiting:** Test that excessive requests are blocked.
5. **Password Reset:** Ensure tokens are generated and passwords are updated correctly.

---

## Environment Variables

Ensure the following variables are set in your `.env` file:

```env
DATABASE=auth_system.db
JWT_SECRET=mysecretkey12345
JWT_EXPIRATION=3600s
```

---

## Docker Deployment

### **Build and Run**

1. Build the Docker image:

   ```bash
   docker build -t jwt-auth-system .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 jwt-auth-system
   ```

3. Access the application at `http://localhost:3000`.

### **Dockerfile**

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

 
