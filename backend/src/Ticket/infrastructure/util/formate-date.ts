export class DateFormater {
    static format(date: Date){
        const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
        const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAYO', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
        
        const dayWeek = days[date.getDay()]
        const month = months[date.getMonth()]
        const day = String(date.getDate()).padStart(2, '0')
        const year = String(date.getFullYear()).slice(2)
        
        const result = `${dayWeek} ${month} ${day} ${year}`

        return result;
    }
}