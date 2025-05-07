export interface Permission {
    id: string
    userId: string
    manageRaffles?: boolean;
    manageSellers?: boolean;
    manageTickets?: boolean;
    manageChatbot?: boolean;
    managePaymentMethods?: boolean;
    manageCustomers?: boolean;
    manageOrders?: boolean;
}