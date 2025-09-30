// src/services/authService.js
import axios from "axios";

export async function login(username, password) {
  try {
    const response = await axios.post("http://localhost:5143/api/Auth/login", {
      userName: username,  //  must match backend DTO
      passwordHash: password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
}
