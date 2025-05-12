export interface Props {
    id: string
    userId: string
    manageRaffles: boolean | null
    manageSellers: boolean | null
    manageTickets: boolean | null
    manageChatbot: boolean | null
    managePaymentMethods: boolean | null
    manageCustomers: boolean | null
    manageOrders: boolean | null
}

export class Permission implements Props {
    id: string
    userId: string
    manageRaffles: boolean | null
    manageSellers: boolean | null
    manageTickets: boolean | null
    manageChatbot: boolean | null
    managePaymentMethods: boolean | null
    manageCustomers: boolean | null
    manageOrders: boolean | null

    constructor(props: Props) {
        this.id =  props.id
        this.userId =  props.userId
        this.manageRaffles =  props.manageRaffles;
        this.manageSellers =  props.manageSellers;
        this.manageTickets =  props.manageTickets;
        this.manageChatbot =  props.manageChatbot;
        this.managePaymentMethods =  props.managePaymentMethods;
        this.manageCustomers =  props.manageCustomers;
        this.manageOrders =  props.manageOrders;
    }
}