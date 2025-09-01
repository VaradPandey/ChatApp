export function OtherUserMessage({ message, index }) {
    const senderName = message.sender?.username || "Deleted User";

    return (
        <div key={index} className="flex justify-start">
            <div className="w-80 bg-gray-700 text-white p-3 rounded-xl rounded-bl-none shadow-md break-words">
                <span className="block text-sm font-semibold text-purple-400 mb-1">
                    {senderName}
                </span>
                <span>{message.content}</span>
            </div>
        </div>
    );
}