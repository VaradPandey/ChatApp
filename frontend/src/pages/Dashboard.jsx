import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import socket from "../api/socket.js";
import api from "../api/axios.js";

export function Dashboard(){
    const {user,logout}=useAuth();
    const navigate=useNavigate();

    const [onlineUserIds,setOnlineUserIds]=useState([]);

    useEffect(()=>{
        const fetchOnlineUsers=async()=>{
            try {
                const res=await api.get("/user/online");
                setOnlineUserIds(res.data.data);
            } catch (err) {
                console.log("Error fetching online users:",err);
            }
        };

        fetchOnlineUsers();

        socket.on("userOnlineFromBackend",(ids)=>{
            setOnlineUserIds(ids);
        });

        return ()=>{
            socket.off("userOnlineFromBackend");
        };
    },[]);

    if (!user) return <LoadingSpinner/>;

    const isOnline=onlineUserIds.includes(user._id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex flex-col items-center justify-center px-6">
            <div className="bg-gray-800 bg-opacity-70 p-8 rounded-2xl shadow-xl w-full max-w-md z-10">

                <h1 className="text-3xl font-semibold mb-2 text-center">Dashboard</h1>
                <p className="mb-6 text-center text-lg">
                    {isOnline?"🟢 Online":"🔴 Offline"}
                </p>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <p className="text-lg">
                            <span className="font-semibold">Name:</span> {user.username}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                    </div>
                    <img
                        className="w-32 aspect-square rounded-full object-cover border-2 border-gray-600"
                        src={user.avatar}
                        alt="User Avatar"
                    />
                </div>

                <button
                    onClick={()=>navigate("/accountSettings")}
                    className="w-full px-5 py-3 bg-red-700 hover:bg-red-800 rounded-lg shadow-md mb-6 transition-all duration-300"
                >
                    Account Settings
                </button>

                <div className="flex flex-col space-y-4">

                    <button
                        onClick={()=>navigate("/inbox")}
                        className="w-full px-5 py-3 bg-purple-700 hover:bg-purple-800 rounded-lg shadow-md transition-all duration-300"
                    >
                        Open Chats
                    </button>

                    <button
                        onClick={()=>{
                            logout();
                            navigate("/login");
                        }}
                        className="w-full px-5 py-3 bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>
        </div>
    );
}
