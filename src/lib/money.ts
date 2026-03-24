import currency from 'currency.js'


export default class Money {
    constructor() {}

    static toCent(amount: string | number) {
        
        amount = currency(amount).multiply(100).value
        amount = parseInt(`${amount}`)

        return amount
    }

    static toDollar(amount: string | number) {
        
        amount = currency(amount, { fromCents: true}).value
        amount = parseFloat(`${amount}`)

        return amount
    }

    static multiply(a: string | number, b: string | number) {
        
        let total = currency(a).multiply(b).value
        total = parseFloat(`${total}`)

        return total
    }

    static divide(a: string | number, b: string | number) {
        
        let total = currency(a).divide(b).value
        total = parseFloat(`${total}`)

        return total
    }

    static format(amount: string | number, decimal = 8) {
        amount = Number(`${amount}`)
        // return currency(amount, { symbol: symbol, separator: ",", decimal: ".", precision: 8, }).format()

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimal
        })

        return formatter.format(amount)
    }
    
    static formatMoney(amount: string | number, decimal = 8, minDecimal = 2) {
        amount = Number(`${amount}`)
        // return currency(amount, { symbol: symbol, separator: ",", decimal: ".", precision: 8, }).format()

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimal,
            maximumFractionDigits: decimal
        })

        return formatter.format(amount)
    }

    static getNumber(str: string | number): number {
        str = `${str}`
        const replaced = str.replace(/[^0-9\.]+/g,"")

        let num: number = 0;

        if (replaced !== '')
            num = Number(replaced)

        return num
    }
    
    static round(amount: string | number, decimal: number = 2): number {
        amount = Money.getNumber(`${amount}`).toFixed(decimal)
        amount = parseFloat(amount)
        
        return amount
    }
}