# Project X: Multi-User Inventory and Checkout Software

Project X is a SaaS software that helps marketplace enterprises to handle checkout with a multi-user functionality allowing every department to access and update inventory without delay.

## Features

- Multi-user system with role-based access control
- User management for super admin (business owner)
- Authentication and authorization mechanisms
- Inventory management and checkout functionality

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Input Validation**: Joi
- **Password Encryption**: bcrypt

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/aphatheology/ProjectX.git
   cd ProjectX
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Create a `.env` file based on `.env.example` and update the values:
   ```
   cp .env.example .env
   ```

4. Create a PostgreSQL database named `project_x`

5. Build the application:
   ```
   yarn run build
   ```

6. Start the server:
   ```
   yarn run start
   ```

7. For development mode with hot-reload:
   ```
   yarn run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register Super Admin

```
POST /v1/api/auth/register
```

Register a new super admin (business owner) with the capability to manage the entire system.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "companyName": "Shoprite",
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Super admin registered successfully",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "isSuperAdmin": true,
    "roleId": "uuid"
  },
  "accessToken": "jwt-token"
}
```

#### Create User (by Super Admin)

```
POST /v1/api/auth/users
```

Super admin can create new users and assign them to roles.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "roleId": "uuid-of-role"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "isSuperAdmin": false,
    "roleId": "uuid-of-role"
  }
}
```

#### Login

```
POST /v1/api/auth/login
```

Login endpoint for all user types.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "YourPassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "fullName": "User Name",
    "email": "user@example.com",
    "isSuperAdmin": false,
    "roleId": "uuid-of-role"
  },
  "accessToken": "jwt-token"
}
```

## Database Schema

The system uses the following entities:

- **Users**: Stores user information including authentication details
- **Companies**: Represents businesses using the system
- **InventoryItems**: Represents inventory available in the system
- **Roles**: Defines user roles within a company
- **Permissions**: Lists available permissions in the system
- **RolePermissions**: Junction table linking roles to their permissions
