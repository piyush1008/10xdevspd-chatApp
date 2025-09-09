
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Icon */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-green-200 transition-colors duration-200">
              {/* Chat App Icon */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg 
                  className="w-6 h-6 text-green-600" 
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
              <span className="text-xl font-bold hidden sm:block">Grooply</span>
            </Link>
          </div>

          {/* Right side - Navigation Links (Desktop) */}
          {!isAuthenticated ? <CheckUserLoginComponent /> : <UserAlreadyLogin onLogout={logout} />}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-green-200 focus:outline-none focus:text-green-200 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-sm">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/signin"
                  className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/chat"
                  className="bg-white text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Chat
                </Link>
                <button
                  onClick={() => { setIsMenuOpen(false); logout(); }}
                  className="bg-white text-green-600 hover:bg-green-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

function CheckUserLoginComponent(){
  return(
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link 
          to="/signup" 
          className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
        >
          Sign Up
        </Link>
        <Link 
          to="/signin" 
          className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

function UserAlreadyLogin({ onLogout }:{ onLogout: () => void }){
  const navigate=useNavigate();
  return(
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link 
          to="/profile" 
          className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
        >
          Profile
        </Link>
        <Link 
          to="/chat" 
          className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Start Chat
        </Link>
        <button onClick={() => { onLogout(); navigate('/'); }}
          className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Logout
        </button>

        <button onClick={() => {  navigate('/joinChat'); }}
          className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Join a Chat
        </button>
      </div>
    </div>
  )
}

export default Navbar;
