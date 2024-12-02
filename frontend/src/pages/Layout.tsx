import { Link, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Layout = () => {

    const auth = useAuth();

    return (
        <main className="flex flex-col h-full">
            <nav className="flex justify-between bg-blue-400">
                <h1 className="p-4 text-2xl font-bold text-white">User Authentication</h1>
                <ul className="flex decoration-none gap-8 justify-end p-4 text-2xl text-white">
                    <li className="hover:underline"><Link to={"/"}>Home</Link></li>
                    { !auth?.user ? 
                        <>
                            <li className="hover:underline"><Link to={"/login"}>Login</Link></li>
                            <li className="hover:underline"><Link to={"/signup"}>Signup</Link></li>
                        </>
                        :
                        <>
                            <li className="hover:underline"><Link to={"/protected"}>Protected</Link></li>
                            <li className="hover:underline hover:cursor-pointer" onClick={auth?.logout}>Logout</li>   
                        </>
                    }
                </ul>
            </nav>
            <Outlet />
        </main>
    )
}

export default Layout