import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { validateJWT, User, DecodedJWT } from "../utils/jwt";

const AuthContext = createContext<UserContext | null>(null)

type LoginRequestBody = {
    email: string,
    password: string
}

type SignupRequestBody = {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
}

type UserContext = {
    user: User | null,
    login: (email: string, password: string)=>Promise<string>,
    logout: ()=>void,
    signup: (fullName: string, email: string, password: string, confirmPassword:string)=>Promise<string>,
}

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {

    useEffect(()=> {
        const token = localStorage.getItem("token")

        const validated = validateJWT(token)

        if (!validated) {
            logout();
        } else {
            let user: User | null = null;

            user = {
                fullName: validated.fullName,
                email: validated.email
            }

            setUser(user);
        }
    }, []);

    const login = async(email: string, password: string): Promise<string> => {

        const body: LoginRequestBody = {
            email: email,
            password: password
        }

        let response;

        try {
            response = await axios.post('http://localhost:8080/login', JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const token = response.data.token;

            const valid = validateJWT(token)

            if (valid) {
                localStorage.setItem('token', token);
                setUser({ fullName: valid.fullName, email: valid.email });
            }


        } catch(err: unknown) {
            const error = err as AxiosError<string, unknown>;
            const data: unknown = error.response?.data;
            return Promise.resolve((data! as { status: string } ).status);
        }

        return Promise.resolve("")

    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    const signup = async(fullName: string, email: string, password: string, confirmPassword: string) : Promise<string> => {
        const body: SignupRequestBody = {
            fullName: fullName,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }

        try {
            await axios.post('http://localhost:8080/signup', JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json"
                }
            });

        } catch (err) {
            const error = err as AxiosError<string, unknown>
            const data: unknown = error.response?.data
            return Promise.resolve((data! as { status: string } ).status)
        }

        return Promise.resolve("")

    }

    const [user, setUser] = useState<User | null>(null)

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)