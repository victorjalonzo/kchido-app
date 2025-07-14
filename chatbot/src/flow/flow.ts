import { createFlow } from "@builderbot/bot";
import buyTicketFlow from "./buy-ticket.flow.js";
import { entryFlow } from "./entry.flow.js";
import { faqFlow } from "./faq.flow.js";
import { menuFlow } from "./menu.flow.js";
import { orderCompletedFlow } from "./order-completed.flow.js";
import { raffleEndedFlow } from "./raffle-ended.flow.js";
import { addGroupFlow } from "./add-group.flow.js";

export const adapterFlow = createFlow([
    entryFlow,
    menuFlow,
    ...buyTicketFlow,
    faqFlow,
    orderCompletedFlow,
    addGroupFlow,
    raffleEndedFlow,
])