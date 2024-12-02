import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/Login"
import './index.css'
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Protected from "./pages/Protected"

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/protected" element={<Protected />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
