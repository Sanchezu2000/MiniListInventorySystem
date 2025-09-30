import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(null);

  // ✅ This runs when login is successful
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser); // removed the stray "a"
  };

  // ✅ Simple logout handler
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen">
      {!user ? (
        // If no user → show login
        <Login onLogin={handleLogin} />
      ) : (
        // If user exists → show home/dashboard
        <div>
          <div className="flex justify-between items-center bg-sky-700 p-4 text-white">
            <h1 className="text-lg font-bold">Welcome, {user.userName}</h1>
            <button
              onClick={handleLogout}
              className="bg-sky-500 px-4 py-2 rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
          <Home />
        </div>
      )}
    </div>
  );
}

export default App;
