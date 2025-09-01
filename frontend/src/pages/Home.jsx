import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white px-6">

            {/* Main Content Box */}
            <div className="bg-gray-800 bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col items-center space-y-6 text-center z-10">

                {/* Title + Quote + Image */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-5xl font-extrabold mb-4 tracking-wider">
                            ChatSphere
                        </h1>
                        <p className="text-lg text-gray-300 italic max-w-xs">
                            "Where conversations become adventures!" 🚀
                        </p>
                    </div>

                    {/* Circle Image */}
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-purple-800 flex items-center justify-center shadow-lg">
                        <img
                            src='images/chatsphere.png'
                            alt="Chat Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 mb-6">
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold">ReactJS</span>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold">TailwindCSS</span>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold">MongoDB</span>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold">ExpressJS</span>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold">Socket.IO</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={()=>navigate('/register')}
                        className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg shadow-lg transition-all duration-300"
                    >
                        Register
                    </button>

                    <button
                        onClick={()=>navigate('/login')}
                        className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-lg transition-all duration-300"
                    >
                        Login
                    </button>
                </div>

                {/* Footer / small note */}
                <p className="mt-6 text-gray-400 text-sm">
                    ChatSphere - Connecting minds, one message at a time
                </p>
            </div>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-0">
                <img src="images/stars.jpg" className="w-full h-full object-cover opacity-10" />
            </div>

        </div>
    );
}
