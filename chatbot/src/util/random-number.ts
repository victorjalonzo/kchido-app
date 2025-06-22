export class RandomSerial {
    static generate (length: number){
        if (length <= 0) throw new Error('Lenght must be greater than 0');

        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
      
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        return number.toString();
    }
}