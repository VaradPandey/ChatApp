import { useEffect,useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

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
        const handleBackButton=(e)=>{
            e.preventDefault();
            navigate("/dashboard",{ replace: true });
        };

        window.addEventListener("popstate",handleBackButton);

        return ()=>{
            window.removeEventListener("popstate",handleBackButton);
        };
    },[navigate]);

    if(loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white p-6 relative">

            {/* Main Content */}
            <div className="relative z-10">
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

                <div className="space-y-4 max-w-3xl mx-auto">
                    {chats.map((chat,index)=>{
                        const otherUser=!chat.isGrp?
                            chat.participants.find(p=>p.username!==user.username) || null:
                            null;

                        const displayName=chat.isGrp?
                            chat.chatName:
                            otherUser===null?
                            "Deleted User":
                            otherUser.username;

                        const displayAvatar=chat.isGrp?
                            chat.grpImage:
                            otherUser===null?
                            "/images/default.png":
                            otherUser.avatar;

                        return (
                            <div
                                key={index}
                                onClick={()=>navigate(`/chatsection/${chat._id}`)}
                                className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl p-4 shadow-md flex items-center gap-4"
                            >
                                <img
                                    src={displayAvatar}
                                    alt="chat avatar"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <span className="block text-lg font-semibold text-indigo-400 mb-1">
                                        {displayName}
                                    </span>
                                    <span className="block text-gray-300 text-sm">
                                        {chat.latestMessage?(
                                            chat.isGrp?(
                                            <>
                                                {chat.latestMessage.sender?.username || "Deleted User"}:
                                                {" "}
                                                {chat.latestMessage.content}
                                            </>
                                            ):(
                                            <>
                                                {chat.latestMessage.sender?.username || "Deleted User"}: {chat.latestMessage.content}
                                            </>
                                            )
                                        ) : (
                                            "Start Chatting"
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>
        </div>
    );
}

