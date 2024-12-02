import { ChangeEvent, useState } from "react"
import { useAuth } from "../hooks/useAuth";

const LoginForm = () => {

    const auth = useAuth();

    const [email, setEmail] = useState<string>("");

    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState("");

    const [loggingIn, setLoggingIn] = useState(false);

    const handleLogin = async() => {
        setLoggingIn(true);
        const status = await auth?.login(email, password);
        setLoggingIn(false)

        if (status) {
            setError("Invalid Credentials")
        }
    }

    if (loggingIn) {
        return (
            <>
                <div className="flex-1 flex justify-center items-center">
                    <h1>Loading...</h1>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-4 p-8 w-1/4">
                <h1 className="text-center font-bold text-4xl">Welcome Back!</h1>
                <input type="email" onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setEmail(e.target.value)
                    setError("")
                }} placeholder="Email" required title="Email is Required" className="p-4 rounded-xl border-2 border-black"/>
                <input type="password" onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setPassword(e.target.value)
                    setError("")
                }} placeholder="Password" required title="Password is Required" className="p-4 rounded-xl border-2 border-black"/>
                <input type="submit" onClick={handleLogin} value={"Login"} className="bg-blue-400 py-4 text-xl text-white rounded-xl hover:cursor-pointer" />
                { error && <h1 className="text-center text-red-600 font-lg font-semibold">{error}</h1>}
            </div>
        </>
    )
}

export default LoginForm