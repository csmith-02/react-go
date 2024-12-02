import { useNavigate } from "react-router-dom"
import SignupForm from "../components/SignupForm"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"

const Signup = () => {

    const auth = useAuth();

    const navigate = useNavigate();

    useEffect(()=>{
        if (auth?.user) {
            navigate("/", { replace: true })
        }
    }, [auth, navigate])

    return (
        <>
            <div className="flex-1 flex justify-center items-center">
                <SignupForm />
            </div>
        </>
    )
}

export default Signup