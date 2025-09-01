import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ChatList } from "./pages/ChatList";
import { ChatSection } from "./pages/ChatSection";
import { CreateGroupChat } from "./pages/CreateGroupChat";
import { CreatePrivateChat } from "./pages/CreatePrivateChat";
import { EditGroupChat } from "./pages/EditGroupChat";
import { AccountSettings } from "./pages/AccountSettings";

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

        <Route path="/chatsection/:chatId" element={
          <ProtectedRoute>
            <ChatSection/>
          </ProtectedRoute>
        }/>

        <Route path="/createGroupChat" element={
          <ProtectedRoute>
            <CreateGroupChat/>
          </ProtectedRoute>
        }/>

        <Route path="/createPrivateChat" element={
          <ProtectedRoute>
            <CreatePrivateChat/>
          </ProtectedRoute>
        }/>

        <Route path="/editgrpsettings/:chatId" element={
          <ProtectedRoute>
              <EditGroupChat/>
          </ProtectedRoute>
        }/>

        <Route path="/accountSettings" element={
          <ProtectedRoute>
            <AccountSettings/>
          </ProtectedRoute>
        }/>
      
      </Routes>
    </BrowserRouter>
  )
}

export default App
