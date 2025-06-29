import { Permission } from "src/Permission/domain/permission.entity"
import { Ticket } from "src/Ticket/domain/ticket.entity"

export enum UserType {
    CUSTOMER = 'customer',
    SELLER = 'seller',
    ADMIN = 'admin',
    CHATBOT = 'chatbot'
}

export enum UserStatus {
    ACTIVE = 'active',
    BANNED = 'banned'
}

interface UserProps {
    id: string
    shortId: string
    name: string
    image: string | null
    role: UserType
    number: string | null
    contactNumber: string | null
    email: string | null
    country: string | null
    state: string | null
    password: string | null
    permissions: Permission | null
    status: UserStatus | null
    createdAt: Date

    tickets?: Ticket[]
}

export class User implements UserProps {
    id: string
    shortId: string
    name: string
    image: string | null
    role: UserType
    number: string | null
    contactNumber: string | null
    email: string | null
    country: string | null
    state: string | null
    password: string | null
    permissions: Permission | null
    status: UserStatus | null
    createdAt: Date
    
    tickets?: Ticket[]

    constructor(props: UserProps) {
        this.id = props.id
        this.shortId = props.shortId
        this.name = props.name
        this.image = props.image
        this.role = props.role
        this.number = props.number
        this.contactNumber = props.contactNumber
        this.email = props.email
        this.country = props.country
        this.state = props.state
        this.password = props.password
        this.permissions = props.permissions
        this.status = props.status
        this.createdAt = props.createdAt
        
        this.tickets = props.tickets ?? []
    }

    get isAdmin(){
        return this.role == UserType.ADMIN ? true : false
    }

    get isChatbot(){
        return this.role == UserType.CHATBOT ? true : false
    }

    get isSeller(){
        return this.role == UserType.SELLER ? true : false 
    }

    get isCustomer(){
        return this.role == UserType.CUSTOMER ? true : false
    }
}