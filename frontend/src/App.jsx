import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/Login";           // Login
import RegistrationPage from "./pages/Registration"; // Registration
import Home from "./pages/Home";                 // Home
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser)); // persist
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* public Routes */}
        {/* Login Page */}
        <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Registration Page */}
        <Route path="/Registration" element={<RegistrationPage />} />

        {/* Protected Home Page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home user={user} />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
