import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomeComponent(){
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    return(
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                        <svg 
                            className="h-10 w-10 text-white" 
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ChatApp</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        {isAuthenticated && user 
                            ? `Hello, ${user.username}! Ready to start chatting?`
                            : 'Connect with friends and family in real-time chat rooms'
                        }
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create New Room */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Room</h3>
                            <p className="text-gray-600 mb-4">Start a new chat room and invite others to join</p>
                            <button
                                onClick={() => navigate('/chat')}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Create Room
                            </button>
                        </div>
                    </div>

                    {/* Join Existing Room */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Existing Room</h3>
                            <p className="text-gray-600 mb-4">Enter a room ID to join an existing chat</p>
                            <button
                                onClick={() => navigate('/join')}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Join Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Authentication Section */}
                {!isAuthenticated && (
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Sign in to start chatting</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/signin')}
                                className="px-6 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}

                {/* Room Sharing Info */}
                {isAuthenticated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-blue-800 text-sm">
                            💡 <strong>Tip:</strong> Share your room ID with friends so they can join your chat room!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}