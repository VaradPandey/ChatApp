import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { UserMessage } from "../components/messages/UserMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { OtherUserMessage } from "../components/messages/OtherUserMessage.jsx";

export function ChatSection() {
    const { chatId }=useParams();
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(true);
    const { user }=useAuth();

    const [newContent,setNewContent]=useState({
        content: "",
        messageType: "text",
        chatId
    });

    useEffect(()=>{
        const fetchMessages=async()=>{
            try{
                const res=await api.get(`/message/msgHistory/${chatId}`);
                setMessages(res.data.data);
                console.log(res.data.data);
            }
            catch(error){
                console.log('CATCH BLOCK ERROR: ',error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchMessages();
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

    if (loading) return <p className="text-center text-white text-xl">Loading Chat Messages...</p>

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex flex-col">
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {
                    messages.map((message,index)=>(
                        (message.sender.username===user.username)?
                        <UserMessage key={index} message={message} index={index} />:
                        <OtherUserMessage key={index} message={message} index={index} />
                    ))
                }
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