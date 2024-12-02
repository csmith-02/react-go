import { ChangeEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const SignupForm = () => {

    const auth = useAuth();

    const [fullName, setFullName] = useState<string>("")

    const [email, setEmail] = useState<string>("");

    const [password, setPassword] = useState<string>("");

    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [error, setError] = useState("")

    const [success, setSuccess] = useState("");

    const handleSignup = async() => {
        const status = await auth!.signup(fullName, email, password, confirmPassword);

        if (status?.length != 0) {
            setError(status!)
            return
        }

        setSuccess("User created!")

    }

    return (
        <>
            <div className="flex flex-col gap-4 p-8 w-1/4">
                <h1 className="text-center font-bold text-4xl">Welcome!</h1>
                <input type="text" onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setFullName(e.target.value)
                    setError("")
                }} placeholder="Full Name" required title="Full Name is Required" className="p-4 rounded-xl border-2 border-black"/>
                <input type="email" onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setEmail(e.target.value)
                    setError("")
                }} placeholder="Email" required title="Email is Required" className="p-4 rounded-xl border-2 border-black"/>
                <input type="password" onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setPassword(e.target.value)
                    setError("")
                }} placeholder="Password" required title="Password is Required" className="p-4 rounded-xl border-2 border-black"/>
                <input type="password" onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setConfirmPassword(e.target.value)
                    setError("")
                }} placeholder="Confirm Password" required title="Confirm Password is Required" className="p-4 rounded-xl border-2 border-black"/>
                <input type="submit" onClick={handleSignup} value={"Signup"} className="bg-blue-400 py-4 text-xl text-white rounded-xl hover:cursor-pointer" />
                { error && <h1 className="text-center text-red-600 text-xl font-lg font-semibold">{error}</h1>}
                { success && <h1 className="text-center text-xl text-green-600 font-lg font-semibold">User Created!</h1> }
            </div>
        </>
    )
}

export default SignupForm