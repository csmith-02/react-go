
import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { validateJWT } from "../utils/jwt"
import { useNavigate } from "react-router-dom"

const Protected = () => {

    const auth = useAuth()

    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if (token) {
            const validated = validateJWT(token)
            
            if (!validated) {
                navigate("/", {replace: true});
            }
        } else {
            auth?.logout();
            navigate("/", {replace: true});
        }
    }, [auth, navigate])

    return (
        <>
            <div className="flex-1 flex flex-col justify-center items-center text-3xl font-bold">
                <h1>Hi <span className="text-red-600">{auth?.user?.fullName}</span>, I'm a protected Route</h1>
                <br/>
                <h1>Your Email is <span className="text-red-600">{auth?.user?.email}</span></h1>
            </div>
        </>
    )
}

export default Protected