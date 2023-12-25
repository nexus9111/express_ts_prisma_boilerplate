import { Role } from "@prisma/client";

export interface User {
    id?: number;
    email: string;
    role?: Role;
    password: string;
}

export interface SafeUser {
    id?: number;
    email: string;
    isAdmin?: boolean;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}