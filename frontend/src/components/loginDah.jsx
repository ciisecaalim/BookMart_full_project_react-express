import { useState } from "react"
import axios from"axios"
import { useNavigate } from "react-router-dom"

function LoginDash(){
    const [userName, setUseuserName] = useState("")
    const [password, setUserPassword] = useState("")

    const navigate = useNavigate()

    const handleLogin =(e) => {
        e.preventDefault()
        axios.post("http://localhost:3000/api/users/login/user", {
            "userName": userName,
            "password" :password
        }).then((res) => {
            if(res.data.error){
                alert("incorrect password or email")
            }else{
                alert("success login")
                navigate("/dash")
                localStorage.setItem("admin", JSON.stringify(res.data))
            }
        })
    }


    return <div className="  flex justify-center">
         <div className="flex justify-center items-center h-screen">
           <form className="space-y-5 bg-blue-400 w-[600px] h-[400px] rounded-lg p-28">
            <input value={userName} onChange={(e) => setUseuserName(e.target.value)} className="w-[380px] text-2xl h-10 rounded-md pl-4 py-4" type="text" name="" id="" placeholder="Enter User Name"/> <br></br>
            <input value={password} onChange={(e) => setUserPassword(e.target.value)} className="w-[380px] text-2xl h-10 rounded-md pl-4 py-4" type="password" name="" id="" placeholder="Enter User password"/><br></br>
        
       <button onClick={handleLogin} className="bg-white text-2xl font-semibold text-black w-32 h-10 mt-8 ml-32 rounded-lg">Login</button> 
         </form>
         </div>

    </div>
}

export default LoginDash