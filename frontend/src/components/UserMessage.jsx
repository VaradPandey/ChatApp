export function UserMessage({message,index}){
    return(
        <div key={index} className="border border-gray-300 rounded-md p-2 mb-2 bg-gray-100">
            <span className="font-bold text-blue-700 mr-2">
                {message.sender.username}:
            </span>
            <span className="text-gray-800">
                {message.content}
            </span>
        </div>
    )
}