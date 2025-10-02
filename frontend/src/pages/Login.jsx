// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

function LoginPage({ onLogin }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // ✅ stop if validation fails

    try {
      const response = await api.login(userName, password);
      // response = { token, id, userName }

      // Save token and user properly
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.id,
          userName: response.userName,
        })
      );

      // Call onLogin with the user object
      onLogin({
        id: response.id,
        userName: response.userName,
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border w-full px-3 py-2 rounded"
              required
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full px-3 py-2 rounded"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/Registration" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
