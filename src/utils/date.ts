export const getCurrentTimeStamp = (digit: number = 10) : number => +new Date().getTime().toString().slice(0, digit);

