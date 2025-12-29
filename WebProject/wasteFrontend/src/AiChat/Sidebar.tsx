import React from 'react';

interface SidebarProps {
    chatSessions: { id: number; created_at: string }[];
    currentSessionId: number | null;
    onNewChat: () => void;
    onLoadChat: (sessionId: number) => void;
  }
  
  const Sidebar: React.FC<SidebarProps> = ({ chatSessions, currentSessionId, onNewChat, onLoadChat }) => {
    return (
      <div className="w-64 bg-[#1e1e1e] p-4 text-white flex flex-col">
        <h2 className="text-lg font-bold mb-4">Chat History</h2>
        <button onClick={onNewChat} className="mb-4 bg-blue-500 p-2 rounded">
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {chatSessions.length > 0 ? (
            chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-2 cursor-pointer ${
                  session.id === currentSessionId ? "bg-blue-700" : "bg-gray-700"
                }`}
                onClick={() => onLoadChat(session.id)}
              >
                Chat {new Date(session.created_at).toLocaleString()}
              </div>
            ))
          ) : (
            <p>No chats yet</p>
          )}
        </div>
      </div>
    );
  };
  

  export default Sidebar