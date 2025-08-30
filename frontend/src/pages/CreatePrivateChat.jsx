import { useState } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

export function CreatePrivateChat(){
    const [body,setBody]=useState({
        username: ""
    })

    const navigate=useNavigate()
    const {user}=useAuth()

    const handleChange=(event)=>{
        setBody(prev=>({...prev,[event.target.name]:event.target.value}))
    }

    const handleSubmit=async(event)=>{
        event.preventDefault()
        try{
            const res=await api.post('/chat/createPrivateChat',body)
            console.log(res.data.data)
            navigate('/inbox')
        }
        catch(error){
            console.log('Login catch block error: ',error)
        }
    }

    return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">
            Create Private Chat
        </h1>

        {/* Username Input */}
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-1">
            Username
            </label>
            <div className="flex">
            <input
                type="text"
                name="username"
                value={body.username}
                onChange={handleChange}
                placeholder="Enter username..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-r-lg transition-all duration-300"
            >
                Add
            </button>
            </div>
        </div>

        {/* Info Box */}
        <p className="text-gray-400 text-sm text-center">
            Enter a username and click <span className="text-purple-400 font-semibold">Add</span> to start a private chat.
        </p>
        </div>
    </div>
    );

}