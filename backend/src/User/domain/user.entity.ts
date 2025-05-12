import { Permission } from "src/Permission/domain/permission.entity"

export enum UserType {
    CUSTOMER = 'customer',
    SELLER = 'seller',
    OWNER = 'owner'
}

interface Props {
    id: string
    name: string
    role: UserType
    number: string | null
    email: string | null
    permissions: Permission | null
    createdAt: Date
}

export class User implements Props {
    id: string
    name: string
    role: UserType
    number: string | null
    email: string | null
    permissions: Permission | null
    createdAt: Date

    constructor(props: Props) {
        this.id = props.id
        this.name = props.name
        this.role = props.role
        this.number = props.number
        this.email = props.email
        this.permissions = props.permissions
        this.createdAt = props.createdAt
    }
}