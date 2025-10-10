import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ParticipantsSidebar from './ParticipantsSidebar';
import EmojiPicker from 'emoji-picker-react';


interface Message {
  message: string;
  username: string;
  timestamp: string;
}

function ChatComponent() {
  const [socket,setSocket]=useState<WebSocket | null>(null);
  const [roomId, setRoomId]=useState("");
  const [participants, setParticipants]=useState<string[]>([])
  const [showParticipants, setShowParticipants]=useState<boolean>(false);
  const [isJoining, setIsJoining] = useState(false);
  const inputRef=useRef<HTMLInputElement>(null);
  const navigate=useNavigate();
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();

  const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://one0xdevspd-chatapp.onrender.com';

  function generateRandomString() {
    return Math.random().toString(36).substring(2, 7);
  }
  
  const [messages, setMessage]=useState<Message[]>([]);
  const { isAuthenticated, user } = useAuth();

  // Redirect if user is not authenticated
  useEffect(() => {
    console.log("refresh happen")
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(()=>{
    // Only create WebSocket connection if user is authenticated
    if (!isAuthenticated || !user) return;

    const ws=new WebSocket("wss://one0xdevspd-chatapp.onrender.com/ws");
//wss://one0xdevspd-chatapp.onrender.com
    // Use room ID from URL if provided, otherwise generate a new one
    const finalRoomId = urlRoomId || generateRandomString();
    setRoomId(finalRoomId);
    setIsJoining(!!urlRoomId); // true if joining existing room

    ws.onopen=()=>{
      console.log("connection established");
      
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomID: finalRoomId,
          username: user.username
        }
      }));

    }

    ws.onmessage=(message)=>{
      console.log( `Message received -> ${message.data}`)
      try {
        const parsedMessage = JSON.parse(message.data);
        setMessage(m => [...m, parsedMessage]);
      } catch (error) {
        // Handle legacy message format (plain text)
        setMessage(m => [...m, {
          message: message.data,
          username: "Unknown",
          timestamp: new Date().toISOString()
        }]);
      }
    }

    setSocket(ws);

    return ()=>{ 
      ws?.close();
    }
  },[user?.username, isAuthenticated, urlRoomId])

  // Show loading state while user data is being fetched
  if (!isAuthenticated || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  const sendMessage=()=>{
      console.log("button clicked");
      const message=inputRef.current?.value || "";
      if (!message.trim()) return;
      console.log(message);
      socket?.send(JSON.stringify({
        type:"chat",
        payload:{
          "message":message
        }
      }));
      if (inputRef.current) inputRef.current.value="";
    }
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
};


  const fetchParticipants = async () => {
    try {
      const result = await axios.post(`${API_URL}/getAllParticipants`, {
        roomId: roomId
      });

      console.log(result.data.participant);
      // Clear existing participants and set new ones to prevent duplicates
      setParticipants(result.data.participant || []);
      setShowParticipants(true);
      
    } 
    catch (error) {
      console.log(error);
      // Handle error - could show a toast notification
    }
  }

  const toggleParticipants = () => {
    if (showParticipants) {
      setShowParticipants(false);
    } else {
      fetchParticipants();
    }
  }

  const handleEmojiClick=(emojiData:any)=>{
    console.log(inputRef.current)
      inputRef.current=inputRef.current+emojiData.emoji;
      console.log(inputRef.current)
  }

  console.log("coding ran till here")
  console.log(showParticipants)
  return (

    <div className='min-h-screen flex bg-gradient-to-br from-green-50 to-blue-50'>
      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Room Header */}
        <div className='bg-white/80 backdrop-blur border-b border-gray-200 p-4'>
          <div className='max-w-3xl mx-auto flex items-center justify-between'>
            <div className='flex items-center gap-3'>
            <h1 className='text-xl font-semibold text-gray-900'>
              {isJoining ? 'Joined Room' : 'New Room'}
            </h1>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono'>
                {roomId}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  // You could add a toast notification here
                  alert('Room ID copied to clipboard!');
                }}
                className='text-gray-400 hover:text-gray-600 transition-colors'
                title='Copy Room ID'
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            </div>
            <div className='flex gap-2'>
            <button
              onClick={() => navigate('/join')}
              className='px-4 py-2 text-sm text-green-600 hover:text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors'
            >
              Join Another Room
            </button>
            <button
              onClick={() => navigate('/')}
              className='px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Home
            </button>

            <button
              onClick={toggleParticipants}
              className='px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              {showParticipants ? 'Hide Participants' : 'Show Participants'}
            </button>
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
        <div className='max-w-3xl mx-auto space-y-3'>
          {messages.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-500'>
                {isJoining ? 'You have joined the room. Start chatting!' : 'Welcome to your new room. Start chatting!'}
              </p>
            </div>
          )}
          {messages.map((msg, idx)=> {
            const isSelf = msg.username === user.username;
            return (
              <div key={idx} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`${isSelf ? 'items-end' : 'items-start'} flex flex-col max-w-[80%]`}>
                  {/* Username display */}
                  <div className={`text-xs text-gray-600 mb-1 ${isSelf ? 'text-right' : 'text-left'}`}>
                    {msg.username}
                  </div>
                  {/* Message bubble */}
                  <span className={`${isSelf ? 'bg-green-500 text-white' : 'bg-white text-gray-800'} rounded-2xl px-4 py-2 shadow-md break-words`}>
                    {msg.message}
                  </span>
                </div>
              </div>
            )
          })}
          </div>
        </div>
        
        <div className='bg-white/80 backdrop-blur border-t border-gray-200'>
        <div className='max-w-3xl mx-auto p-3 sm:p-4 flex items-center gap-2'>
          <input ref={inputRef}   onKeyPress={handleKeyPress} className='flex-1 outline-none bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition' type="text" placeholder="Enter your message..." />
         <EmojiPicker  onEmojiClick={handleEmojiClick}/>
          <button onClick={sendMessage} className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl shadow-md transition cursor-pointer'>Send</button> 
        </div>
      </div>
      </div>

      {/* Participants Sidebar */}
      <ParticipantsSidebar
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        participants={participants}
        roomId={roomId}
        onRefresh={fetchParticipants}
      />
    </div>
    
  )
}

export default ChatComponent
