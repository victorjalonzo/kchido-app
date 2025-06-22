export class TicketSerial {
    static generate(serialAmount?: number): number[]{
        const serials: number[] = []

        for (let i = 1; i<= ( serialAmount ?? 1); i++) {
            const serial = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
            serials.push(serial)
        }

        return serials;
    }
}