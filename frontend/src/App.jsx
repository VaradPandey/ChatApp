import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute"

function App(){
  
  return (
    <BrowserRouter>
      <Routes>

        {/*Public Route*/}
        <Route path="/" element={<h2>HI</h2>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>

        {/*Protected Route*/}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
      
      </Routes>
    </BrowserRouter>
  )
}

export default App
