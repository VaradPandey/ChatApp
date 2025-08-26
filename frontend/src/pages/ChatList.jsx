import { useEffect,useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export function ChatList() {
    const [chats,setChats]=useState([]);
    const [loading,setLoading]=useState(true);
    const { user }=useAuth();
    const navigate=useNavigate();

    useEffect(()=>{
        const fetchChats=async()=>{
            try{
                const res=await api.get('/chat/inbox');
                setChats(res.data.data);
            }catch(error){
                console.log("Error Fetching Chats || Catch Block",error);
            }finally{
                setLoading(false);
            }
        };

        fetchChats();
    },[]);

    useEffect(()=>{
        console.log(chats);
    },[chats]);

    if(loading){
        return <p className="text-center text-white text-xl">Loading Chats...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Chats</h1>
            
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={()=>navigate('/createGroupChat')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition duration-300"
                >
                    New Group Chat
                </button>
                <button
                    onClick={()=>navigate('/createPrivateChat')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition duration-300"
                >
                    New DM
                </button>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
                {chats.map((chat,index)=>(
                    <div
                        key={index}
                        onClick={()=>navigate(`/chatsection/${chat._id}`)}
                        className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl p-4 shadow-md"
                    >
                        <span className="block text-lg font-semibold text-indigo-400 mb-1">
                            {chat.isGrp?chat.chatName:chat.participants[1].username}
                        </span>
                        <span className="block text-gray-300">
                            {
                                chat.latestMessage?
                                `${chat.latestMessage.sender.username}: ${chat.latestMessage.content}`:
                                 'Start Chatting'
                            }
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
