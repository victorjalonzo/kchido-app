
import { Permission } from "../../Permission/domain/permission.type.js";
import { UserRole } from "./user-role.enum.js";

export interface BaseUser {
    name: string;
    number?: number;
    email?: string;
}

export interface CustomerUser extends BaseUser {
    number: number
    role: UserRole.customer
}

export interface SellerUser extends BaseUser {
    email: string
    pwd: string
    role: UserRole.seller
    permissions: Permission
}

export interface OwnerUser {
    email: string
    pwd: string
    role: UserRole.owner,
    permissions: Permission
}

export type User = CustomerUser | SellerUser | OwnerUser