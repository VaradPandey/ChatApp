import { useEffect,useState,useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../api/axios.js";
import { UserMessage } from "../components/messages/UserMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { OtherUserMessage } from "../components/messages/OtherUserMessage.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import socket from "../api/socket.js";


export function ChatSection() {
    const { chatId }=useParams();
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(true);
    const [chatInfo,setChatInfo]=useState({});
    const { user }=useAuth();
    const navigate=useNavigate();

    const messagesEndRef=useRef(null);

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

    useEffect(()=>{
        socket.on("msgFromBackend",({msg,chatId:updatedChatId})=>{
            if(updatedChatId!==chatId) return;
            setMessages(prev=>[...prev,msg]);
        })

        socket.on("editMsgFromBackend",({msgId,newContent,chatId:updatedChatId})=>{
            if(updatedChatId!==chatId) return;
            setMessages(prev=>prev.map(m=>m._id=== msgId?{...m,content:newContent}:m));
        })

        socket.on("deleteMsgFromBackend",({msgId,chatId:updatedChatId})=>{
            if(updatedChatId!==chatId) return;
            setMessages(prev=>prev.filter(m=>m._id!==msgId));
        });

        socket.on("exitGrpFromBackend",({userId,chatId:updatedChatId})=>{
            if(updatedChatId!==chatId) return;
        })

        return()=>{
            socket.off("msgFromBackend");
            socket.off("editMsgFromBackend");
            socket.off("deleteMsgFromBackend");
            socket.off("exitGrpFromBackend");
        }

    },[chatId])

    useEffect(()=>{
        const handleChatUpdate=({chatId:updatedChatId,updatedChat})=>{
            if(updatedChatId!==chatId) return;
            setChatInfo(updatedChat);
        };

        socket.on("editGrpNameFromBackend",handleChatUpdate);
        socket.on("editGrpIconFromBackend",handleChatUpdate);
        socket.on("addMembersFromBackend",handleChatUpdate);
        socket.on("removeMembersFromBackend",handleChatUpdate);

        return()=>{
            socket.off("editGrpNameFromBackend");
            socket.off("editGrpIconFromBackend");
            socket.off("addMembersFromBackend");
            socket.off("removeMembersFromBackend");
        }
    },[chatId]);

    const handleChange=(event)=>{
        setNewContent(prev=>({ ...prev,[event.target.name]: event.target.value }))
    }

    useEffect(()=>{
        const handleBackButton=(e)=>{
            e.preventDefault();
            navigate('/inbox',{ replace: true });
        };

        window.addEventListener("popstate",handleBackButton);

        return ()=>{
            window.removeEventListener("popstate",handleBackButton);
        };
    },[navigate]);

    const handleSubmitContent=async(event)=>{
        event.preventDefault();
        if(!newContent.content.trim()) return;

        try{
            const res=await api.post('/message/createMessage',newContent);
            setNewContent({ content: "",messageType: "text",chatId });
            
            socket.emit("msgFromFrontend",{
                msg:res.data.data,
                chatId
            })
        }
        catch(error){
            console.log('CATCH BLOCK ERROR: ',error);
        }
    }

    const leaveGroupChat=async(chatId)=>{
        if(!window.confirm("Are you sure you want to leave this group")) return;

        try{
            const res=await api.post(`/chat/${chatId}/exitGrpChat`);
            socket.emit("exitGrpFromFrontend",{
                userId: user._id,
                chatId,
            })
            navigate('/inbox')
        }catch(error){
            console.log('CATCH BLOCK LEAVE GROUP CHAT ERROR: ',error);
        }
    }

    const editMessage=async(msgId)=>{
        if(!editText.trim()) return;

        try{
            const res=await api.post(`/message/${msgId}`,{ newText: editText });
            setMessages(prev=>prev.map(m=>m._id===msgId ? {...m,content: res.data.data.content} : m));
            setEditingMsgId(null);
            setEditText("");
            socket.emit("editMsgFromFrontend",{
                msgId,
                newContent: res.data.data.content,
                chatId
            })
        }catch(error){
            console.log("EDIT MESSAGE ERROR:",error);
        }
    };

    const deleteMessage=async(msgId)=>{
        if(!window.confirm("Are you sure you want to delete this message?")) return;

        try{
            await api.post(`/message/${msgId}/del`);
            setMessages(prev=>prev.filter(m=>m._id !== msgId));
            socket.emit("deleteMsgFromFrontend",{
                msgId,
                chatId
            })
        }catch(error){
            console.log("DELETE MESSAGE ERROR:",error);
        }
    };

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
    },[messages]);

    if (loading) return <LoadingSpinner></LoadingSpinner>

    return(
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex flex-col h-screen">

            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 z-10 relative">
                {/* Left Side */}
                <div className="flex items-center gap-3 z-10">
                    {chatInfo&&(
                    <>
                        <img src={
                            chatInfo.isGrp?
                            chatInfo.grpImage:
                            chatInfo.participants?.find(p=>p.username!==user.username)?.avatar
                            ||"/images/default.png"
                        } 
                        alt="chat avatar" 
                        className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-white">
                                {
                                    chatInfo.isGrp?
                                    chatInfo.chatName:
                                    chatInfo.participants?.find(p => p.username !== user.username)?.username
                                    ||"Deleted User"
                                }
                            </span>
                            <span className="text-sm text-gray-400">
                                {
                                    chatInfo.isGrp?
                                    `${chatInfo.participants.filter(p => p.isOnline).length} online`:
                                    chatInfo.participants?.find(p => p.username !== user.username)?.isOnline?
                                    "Online":
                                    "Offline"
                                }
                            </span>
                        </div>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 relative">
                {messages.map((message,index)=>{
                    const senderUsername=message.sender?.username;
                    const isUser=senderUsername===user.username;

                    return isUser ? (
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
                                onClick={()=>{ setEditingMsgId(null); setEditText(""); }}
                                className="px-3 py-1 text-white rounded-lg text-sm"
                                >
                                Cancel
                                </button>
                            </div>
                            ):(
                            <>
                                <div className="flex gap-2 mb-1 px-3 py-1 rounded-lg shadow-md w-fit">
                                    {senderUsername&&(
                                        <>
                                        <button
                                            onClick={()=>{ setEditingMsgId(message._id); setEditText(message.content); }}
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
                                        </>
                                    )}
                                </div>
                                <UserMessage message={message} index={index} />
                            </>
                            )}
                        </div>
                    ):(
                        <OtherUserMessage key={index} message={message} index={index} />
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="bg-gray-800 p-4 flex items-center space-x-3 border-t border-gray-700 z-10 relative">
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

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="/images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>
        </div>
    );
}
