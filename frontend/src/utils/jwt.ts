import { jwtDecode, JwtPayload } from "jwt-decode"

export type User = {
    fullName: string,
    email: string
}

export type DecodedJWT = JwtPayload & User

export function validateJWT(token: string|null): DecodedJWT|null {

    if (!token) {
        return null
    }

    try {
        const decoded = jwtDecode<DecodedJWT>(token!);
        const now = Math.floor(Date.now() / 1000)
        if (!decoded.fullName || !decoded.email || decoded.exp! < now) {
            return null
        }
        return decoded
    } catch {
        return null
    }
}