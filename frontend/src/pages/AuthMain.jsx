// src/App.jsx
import { useState } from "react";
import RegisterPage from "./Registration";
import LoginPage from "./Login";
import HomePage from "./Home";

function AuthMain() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  function handleLogin(loggedInUser) {
  console.log("Logged in user:", loggedInUser);
  localStorage.setItem("user", JSON.stringify(loggedInUser)); // ✅ save whole object
  setUser(loggedInUser);
}


  return (
    <div className="min-h-screen">
      {!user ? (
        <div>
          {showRegister ? (
            <RegisterPage onRegister={() => setShowRegister(false)} />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )}
          <div className="text-center mt-4">
            {showRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-600 underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-600 underline"
                >
                  Register
                </button>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <HomePage />
        </div>
      )}
    </div>
  );
}

export default AuthMain;
