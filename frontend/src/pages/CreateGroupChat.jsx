import { useState,useEffect } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import socket from "../api/socket.js";

export function CreateGroupChat() {
    const [userArr,setUserArr]=useState([]);
    const [usernameInput,setUsernameInput]=useState("");
    const navigate=useNavigate();

    const [body,setBody]=useState({
        chatName: "",
        usernames: []
    });

    const handleChange=(event)=>{
        setBody((prev)=>({ ...prev,[event.target.name]:event.target.value }));
    };

    const handleAddUser=()=>{
        if(usernameInput.trim()!==""){
            const updatedUsers=[...userArr,usernameInput.trim()];
            setUserArr(updatedUsers);
            setBody((prev)=>({ ...prev,usernames: updatedUsers }));
            setUsernameInput("");
        }
    };

    const handleSubmit=async(event)=>{
        event.preventDefault();
        if(userArr.length===0 || !body.chatName.trim()) return;
        try{
            const res=await api.post('/chat/createGroupChat',body);
            socket.emit("newChatFromFrontend",{ chat: res.data.data});
        }
        catch(error){
            console.log('Submit Fail Catch Block Error: ',error);
        }
    }

    useEffect(()=>{
        const handleBackButton=(e)=>{
            e.preventDefault();
            navigate("/inbox",{ replace: true });
        };

        window.addEventListener("popstate",handleBackButton);

        return ()=>{
            window.removeEventListener("popstate",handleBackButton);
        };
    },[navigate]);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md z-10">
                <h1 className="text-2xl font-bold mb-4 text-center text-white">
                    Create Group Chat
                </h1>
                
                {/* Chat Name Input */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Chat Name</label>
                    <input
                        type="text"
                        name="chatName"
                        value={body.chatName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter group name"
                    />
                </div>

                {/* Username Input */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Add Username</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={usernameInput}
                            onChange={(event)=>setUsernameInput(event.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter username"
                        />
                        <button
                            type="button"
                            onClick={handleAddUser}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-r-lg transition-all duration-300"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Display Added Users */}
                {userArr.length>0&&(
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-gray-300 mb-2">Users:</h2>
                        <div className="flex flex-wrap gap-2">
                            {userArr.map((user,index)=>(
                                <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                                    {user}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="button"
                    className="w-full py-2 mt-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
                    onClick={(event)=>{
                        handleSubmit(event);
                        navigate('/inbox');
                    }}
                >
                    Create Group
                </button>
            </div>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>
        </div>
    );
}
