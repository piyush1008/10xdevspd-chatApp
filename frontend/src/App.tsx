import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ChatComponent from './Pages/ChatComponent'
import HomeComponent from './Pages/HomeComponent'
import Navbar from './Pages/Navbar'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import { AuthProvider } from './context/AuthContext'
import JoinChat from './Pages/JoinChat'

function App() {
 
  return(
    <>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
            <Route path="/chat" element={<ChatComponent />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<HomeComponent />} />
            <Route path="/joinChat" element={<JoinChat />} />

            <Route path="/signin" element={<Signin />} />

        </Routes>
      </AuthProvider>
    
    </BrowserRouter>
    </>
  )
}

export default App
