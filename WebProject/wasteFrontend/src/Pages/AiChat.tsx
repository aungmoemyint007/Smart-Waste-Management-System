import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Menu, Paperclip, ImagePlus, Loader2, MessageSquare, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  image_path: string | null;
  sender: 'user' | 'ai';
  created_at: string;
}

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionList, setSessionList] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0); // State to track sidebar key
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchChatHistory(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
    fetchSessionList();
  }, []);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('chatSessionId', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateSessionId = (): string => {
    return 'session_' + Math.random().toString(36).substring(2, 15);
  };

  const fetchChatHistory = async (sessionId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat-history/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchSessionList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/session-list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setSessionList(response.data.reverse()); // Reverse the session list
      setSidebarKey(prevKey => prevKey + 1); // Update sidebar key to remount
    } catch (error) {
      console.error('Error fetching session list:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message && !image) {
      alert('Please enter a message or upload an image.');
      return;
    }

    if (!sessionId) {
      console.error('No session ID available.');
      return;
    }

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('session_id', sessionId);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('http://localhost:8000/api/send-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage('');
      setImage(null);
      setPreviewImage(null);
      await fetchChatHistory(sessionId); // Refresh after sending
      fetchSessionList(); // Fetch session list to update sidebar
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSessionClick = (sessionId: string) => {
    setSessionId(sessionId);
    fetchChatHistory(sessionId);
  };

  const handleNewChatClick = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
    setChatHistory([]);
    fetchSessionList();
  };

  const getImageUrl = (imagePath: string | null): string | undefined => {
    if (!imagePath) {
      return undefined;
    }
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="h-[92vh] flex">
      {/* Sidebar */}
      <div
        key={sidebarKey} // Add key prop to force remount
        className={`bg-gray-950 text-mine-shaft-50 w-64 flex-shrink-0 transition-width duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-4">Ai Chat</h2>
          <button onClick={handleNewChatClick} className="text-gray-500 hover:text-gray-700">
            <MessageSquare className="h-6 w-6 -mt-2" />
          </button>
        </div>
        <nav className="p-4">
            <ul className="list-none">
            {sessionList.map((session) => (
              <li
              key={session.session_id}
              className={`py-2 rounded !ml-0 pl-[1rem] ${session.session_id === sessionId ? 'bg-gray-800' : ''}`}
              >
              <button onClick={() => handleSessionClick(session.session_id)} className="block w-full text-left">
                {session.session_title}
              </button>
              </li>
            ))}
            </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-mine-shaft-950">
        {/* Chat Area */}
        <div
          className="flex-1 p-4 overflow-y-auto flex flex-col"
          ref={chatContainerRef}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {chatHistory.length === 0 && (
            <div className="text-center text-mine-shaft-50 mt-4">No messages yet.</div>
          )}
          {Array.isArray(chatHistory) &&
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`mb-2 p-3 rounded-lg max-w-fit ${
                  chat.sender === 'user'
                    ? 'bg-mine-shaft-900 text-mine-shaft-100 self-end'
                    : 'bg-mine-shaft-900 text-mine-shaft-100 self-start'
                }`}
              >
                {chat.message && <p>{chat.message}</p>}
                {chat.image_path && (
                  <img
                    src={getImageUrl(chat.image_path)}
                    alt="Uploaded"
                    className="max-w-full h-auto rounded-md mt-2"
                  />
                )}
                <div className="text-xs text-mine-shaft-400 mt-1">
                  {chat.sender === 'user' ? 'You' : 'AI'} -{' '}
                  {format(new Date(chat.created_at), 'MMM dd, yyyy h:mm a')}
                  <CheckCheck className="inline w-5 h-5 ml-3 text-green-400" />

                </div>
              </div>
            ))}
          {isSending && (
            <div className="text-center text-gray-500 mt-4">
              <Loader2 className="inline animate-spin" /> Sending...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            {previewImage && (
              <div className="w-24 h-24 relative">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-md" />
                <button
                  onClick={() => {
                    setImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  X
                </button>
              </div>
            )}

            <input
              type="text"
              className="flex-1 p-2 border-none outline-none rounded-md focus:outline-none focus:ring bg-mine-shaft-900 text-white"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSending) {
                  handleSendMessage();
                }
              }}
              disabled={isSending}
            />

            <div className="flex space-x-2">
              <label htmlFor="image-upload" className="cursor-pointer text-gray-500 hover:text-gray-700">
                <ImagePlus className="h-6 w-6" width={14} height={14} />
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <button
                className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none ${
                  isSending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSendMessage}
                disabled={isSending}
              >
                {isSending ? <Loader2 className="inline animate-spin" /> : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;