export default class BaseConverter {
    dec2hex(number: number, padding: number = 0): string {
        return number.toString(16).padStart(padding, '0');
    }
}