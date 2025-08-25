import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ChatList } from "./pages/ChatList";

function App(){
  
  return (
    <BrowserRouter>
      <Routes>

        {/*Public Route*/}
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>

        {/*Protected Route*/}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>

        <Route path="/inbox" element={
          <ProtectedRoute>
            <ChatList/>
          </ProtectedRoute>
        }/>
      
      </Routes>
    </BrowserRouter>
  )
}

export default App
