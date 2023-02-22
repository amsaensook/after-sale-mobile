import jwt_decode from "jwt-decode";

export const getTimeFromToken = (token: string): number => {
    const { time }: any = token ? jwt_decode(token) : 0;
    return time;
};