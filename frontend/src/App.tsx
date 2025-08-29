import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ChatComponent from './Pages/ChatComponent'


function App() {
 
  return(
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
