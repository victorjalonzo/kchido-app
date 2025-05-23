import { Permission } from "src/Permission/domain/permission.entity"

export enum UserType {
    CUSTOMER = 'customer',
    SELLER = 'seller',
    OWNER = 'owner'
}

export enum UserStatus {
    ACTIVE = 'active',
    BANNED = 'banned'
}

interface Props {
    id: string
    name: string
    role: UserType
    number: string | null
    email: string | null
    password: string | null
    permissions: Permission | null
    status: UserStatus | null
    createdAt: Date
}

export class User implements Props {
    id: string
    name: string
    role: UserType
    number: string | null
    email: string | null
    password: string | null
    permissions: Permission | null
    status: UserStatus | null
    createdAt: Date

    constructor(props: Props) {
        this.id = props.id
        this.name = props.name
        this.role = props.role
        this.number = props.number
        this.email = props.email
        this.password = props.password
        this.permissions = props.permissions
        this.status = props.status
        this.createdAt = props.createdAt
    }
}