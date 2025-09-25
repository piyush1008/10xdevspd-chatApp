import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function JoinChat(){
    const [joinRoomID, setJoinRoomId]=useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(false);
    const navigate=useNavigate();
    const { isAuthenticated } = useAuth();

    const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://one0xdevspd-chatapp.onrender.com';

    // Redirect if user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    const validateRoomAndNavigate = async () => {
        try {
            setChecking(true);
            const res = await fetch(`${API_URL}/room/${encodeURIComponent(joinRoomID.trim())}/exists`);
            const data = await res.json();
            if (data?.exists) {
                navigate(`/chat/${joinRoomID.trim()}`);
            } else {
                // room doesn't exist → route to home
                navigate("/");
            }
        } catch (e) {
            // on error also route to home as safe fallback
            navigate("/");
        } finally {
            setChecking(false);
        }
    }

    const handleJoinRoom = () => {
        if (!joinRoomID.trim()) {
            setError("Please enter a room ID");
            return;
        }
        
        if (joinRoomID.trim().length < 3) {
            setError("Room ID must be at least 3 characters");
            return;
        }

        setError("");
        validateRoomAndNavigate();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJoinRoom();
        }
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                        <svg 
                            className="h-8 w-8 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Chat Room</h2>
                    <p className="text-gray-600">Enter the room ID to join an existing chat</p>
                </div>

                {/* Join Room Form */}
                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Room ID Field */}
                        <div>
                            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                                Room ID
                            </label>
                            <input
                                id="roomId"
                                type="text"
                                value={joinRoomID}
                                onChange={(e) => {
                                    setJoinRoomId(e.target.value);
                                    if (error) setError("");
                                }}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400"
                                placeholder="Enter the room ID"
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-600">{error}</p>
                            )}
                        </div>
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={handleJoinRoom}
                        disabled={checking}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {checking ? 'Checking...' : 'Join Room'}
                    </button>

                    {/* Back to Home */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm text-green-600 hover:text-green-500 transition-colors duration-200"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}