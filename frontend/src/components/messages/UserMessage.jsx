export function UserMessage({ message,index }) {
    return (
        <div key={index} className="flex justify-end">
            <div className="w-80 bg-indigo-200 text-white p-3 rounded-xl rounded-br-none shadow-md break-words">
                <span className="block text-sm font-semibold text-indigo-900 mb-1">
                    {message.sender.username}
                </span>
                <span className="block text-sm font-semibold text-black mb-1">{message.content}</span>
            </div>
        </div>
    );
}