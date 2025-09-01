import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../api/axios.js";
import { UserMessage } from "../components/messages/UserMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { OtherUserMessage } from "../components/messages/OtherUserMessage.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

export function ChatSection() {
    const { chatId }=useParams();
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(true);
    const [chatInfo,setChatInfo]=useState({});
    const { user }=useAuth();
    const navigate=useNavigate();

    const [newContent,setNewContent]=useState({
        content: "",
        messageType: "text",
        chatId
    });

    const [editingMsgId,setEditingMsgId]=useState(null);
    const [editText,setEditText]=useState("");

    useEffect(()=>{
        const fetchMessages=async()=>{
            try{
                const res=await api.get(`/message/msgHistory/${chatId}`);
                setMessages(res.data.data);
                console.log(res.data.data);
            }
            catch(error){
                console.log('CATCH BLOCK FETCH MESSAGES ERROR: ',error);
            }
            finally{
                setLoading(false);
            }
        }

        const fetchChatInfo=async()=>{
            try{
                const res=await api.get(`/chat/${chatId}`)
                setChatInfo(res.data.data)
                console.log(res.data.data)

            }catch(error){
                console.log('CATCH BLOCK FETCH CHAT INFO ERROR: ',error);
            }
        }

        fetchMessages();
        fetchChatInfo();
    },[]);

    const handleChange=(event)=>{
        setNewContent(prev=>({ ...prev,[event.target.name]: event.target.value }))
    }

    const handleSubmitContent=async(event)=>{
        event.preventDefault();
        if(!newContent.content.trim()) return;

        try{
            const res=await api.post('/message/createMessage',newContent);
            setMessages(prev=>[...prev,res.data.data]);
            setNewContent({ content: "",messageType: "text",chatId });
            console.log(res.data.data);
        }
        catch(error){
            console.log('CATCH BLOCK ERROR: ',error);
        }
    }

    const leaveGroupChat=async(chatId)=>{
        try{
            const res=await api.post(`/chat/${chatId}/exitGrpChat`);
            console.log(res.data.data)
            navigate('/inbox')
        }catch(error){
            console.log('CATCH BLOCK LEAVE GROUP CHAT ERROR: ',error);
        }
    }

    const editMessage=async(msgId)=>{
        if (!editText.trim()) return;
        try{
            const res=await api.post(`/message/${msgId}`,{ newText: editText });
            setMessages(prev=>prev.map(m=>m._id===msgId ?{...m,content: res.data.data.content }:m));
            setEditingMsgId(null);
            setEditText("");
        }catch(error){
            console.log("EDIT MESSAGE ERROR:",error);
        }
    };

    const deleteMessage=async(msgId)=>{
        try{
            await api.post(`/message/${msgId}/del`);
            setMessages(prev=>prev.filter(m=>m._id !== msgId));
        }catch(error){
            console.log("DELETE MESSAGE ERROR:",error);
        }
    };

    if (loading) return <LoadingSpinner></LoadingSpinner>

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex flex-col h-screen">

            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
            {/* Left Side */}
            <div className="flex items-center gap-3">
                {chatInfo&&(
                <>
                    <img src={chatInfo.isGrp?
                        chatInfo.grpImage:
                        chatInfo.participants?.find(p=>p.username!==user.username)?.avatar} 
                    alt="chat avatar" 
                    className="w-10 h-10 rounded-full"
                    />
                    <h1 className="text-lg font-semibold text-white">
                    {chatInfo.isGrp?
                    chatInfo.chatName:
                    chatInfo.participants?.find(p=>p.username!==user.username)?.username}
                    </h1>
                </>
                )}
            </div>

            {/* Right Side */}
            {chatInfo.isGrp && (
                <div className="flex items-center gap-2">
                <button 
                    onClick={()=>navigate(`/editgrpsettings/${chatInfo._id}`)} 
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                >
                    Settings
                </button>
                <button
                    onClick={()=>leaveGroupChat(chatInfo._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                    Exit
                </button>
                </div>
            )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index)=>
                    message.sender.username===user.username?(
                    <div key={index} className="space-y-1 flex flex-col items-end">
                        {editingMsgId===message._id?(
                        <div className="flex items-center gap-2 p-2 rounded-lg shadow-md">
                            <input
                            type="text"
                            value={editText}
                            onChange={(e)=>setEditText(e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg text-white focus:ring-2 focus:ring-purple-600"
                            />
                            <button
                            onClick={()=>editMessage(message._id)}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm"
                            >
                            Save
                            </button>
                            <button
                            onClick={()=>{
                                setEditingMsgId(null);
                                setEditText("");
                            }}
                            className="px-3 py-1 text-white rounded-lg text-sm"
                            >
                            Cancel
                            </button>
                        </div>
                        ):(
                        <>
                            <div className="flex gap-2 mb-1 px-3 py-1 rounded-lg shadow-md w-fit">
                            <button
                                onClick={()=>{
                                setEditingMsgId(message._id);
                                setEditText(message.content);
                                }}
                                className="text-xs text-purple-400 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={()=>deleteMessage(message._id)}
                                className="text-xs text-red-400 hover:underline"
                            >
                                Delete
                            </button>
                            </div>
                            <UserMessage message={message} index={index} />
                        </>
                        )}
                    </div>
                    ):(
                    <OtherUserMessage key={index} message={message} index={index} />
                    )
                )}
            </div>

            {/* Input Section */}
            <div className="bg-gray-800 p-4 flex items-center space-x-3 border-t border-gray-700">
                <input
                    type="text" placeholder="Type Message Here..." name="content" value={newContent.content}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                    onClick={handleSubmitContent}
                    className="px-5 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
}