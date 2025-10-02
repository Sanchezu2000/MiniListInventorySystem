// frontend/src/pages/RegisterPage.jsx
import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

function RegisterPage({ onRegister }) {
  const [UserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!UserName.trim()) {
      newErrors.UserName = "Username is required.";
    } else if (UserName.length < 3) {
      newErrors.UserName = "Username must be at least 3 characters.";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password validation
    if (!Password) {
      newErrors.Password = "Password is required.";
    } else if (Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters.";
    } else if (!/\d/.test(Password)) {
      newErrors.Password = "Password must include at least one number.";
    }

    return newErrors;
  };

  console.log(UserName);
  console.log(email);
  console.log(Password);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newUser = await api.register({
        UserName,
        email,
        Password,
      });

      setSuccess("Registration successful! You can now log in.");
      navigate("/Login");
      if (onRegister) onRegister(newUser);
    } catch (err) {
      setErrors({ form: "You already have an account." });
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        {errors.form && <p className="text-red-500 mb-3">{errors.form}</p>}
       {success && <p className="text-green-500 mb-3">{success}</p>}


        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              className={`border w-full px-3 py-2 rounded ${
                errors.UserName ? "border-red-500" : ""
              }`}
            />
            {errors.UserName && (
              <p className="text-red-500 text-sm mt-1">{errors.UserName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border w-full px-3 py-2 rounded ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border w-full px-3 py-2 rounded ${
                errors.Password ? "border-red-500" : ""
              }`}
            />
            {errors.Password && (
              <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Register
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
