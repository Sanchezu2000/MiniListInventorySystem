import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthMain from "./pages/AuthMain";
import RegisterPage from "./pages/Registration";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

 
function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path ="/"element={<AuthMain/>} />
          <Route path ="/Registration"element={<RegisterPage/>} />
           <Route path ="/Login"element={<LoginPage onLogin={()=> {}}/>} />
           <Route path ="/Home"element={< HomePage/>} />
      
        </Routes>
    </BrowserRouter>

  )
}
 
export default App