import { useNavigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"

const Login = () => {
    const auth = useAuth()

    const navigate = useNavigate()

    useEffect(()=>{
        if (auth?.user) {
            navigate("/protected", { replace: true })
        }
    }, [auth, navigate])

    return (
        <>
            <div className="flex-1 flex justify-center items-center">
                <LoginForm />
            </div>
        </>
    )
}

export default Login