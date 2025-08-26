import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate=useNavigate();
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
            <h1 className="text-4xl font-bold mb-8 tracking-wide">WELCOME TO CHAT APP</h1>
            <div className="space-x-4">
                <button 
                    onClick={()=>navigate('/register')} 
                    className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg shadow-lg transition-all duration-300">
                    Register
                </button>
                <button 
                    onClick={()=>navigate('/login')} 
                    className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-lg transition-all duration-300">
                    Login
                </button>
            </div>
        </div>
    );
}
