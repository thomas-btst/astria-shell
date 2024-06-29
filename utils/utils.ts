export function capitalize(str: string): string{
    return str.slice(0,1).toUpperCase() + str.slice(1)
}

export function withDigits(number: number, digits: number = 2): string{
    return number.toString().padStart(digits, '0')
}

export function limitNumberWithinRange(num: number, min: number, max: number): number{
    return Math.max(Math.min(max, num), min)
}

export function modulo(num: number, mod: number) {
    return ((num % mod) + mod) % mod;
}
