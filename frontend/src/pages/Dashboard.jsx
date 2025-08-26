import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChatList } from "./ChatList";

// Protected Page
export function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex flex-col items-center justify-center px-6">
            <div className="bg-gray-800 bg-opacity-70 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
                <p className="mb-3 text-lg"><span className="font-semibold">Name:</span> {user.username}</p>
                <p className="mb-6 text-lg"><span className="font-semibold">Email:</span> {user.email}</p>

                <div className="flex flex-col space-y-4">
                    <button
                        type="submit"
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full px-5 py-3 bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md transition-all duration-300"
                    >
                        Logout
                    </button>

                    <button
                        onClick={() => { navigate('/inbox'); }}
                        className="w-full px-5 py-3 bg-purple-700 hover:bg-purple-800 rounded-lg shadow-md transition-all duration-300"
                    >
                        Open Chats
                    </button>
                </div>
            </div>
        </div>
    );
}
