type JwtPayload = {
    username: string;
    name: string;
}

export type LoginResponse = {
    token: string;
    payload: JwtPayload;
}