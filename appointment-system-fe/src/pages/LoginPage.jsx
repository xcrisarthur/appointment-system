import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/LoginPage.css"; // file CSS eksternal

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", { username });
      localStorage.setItem("token", data.token);
      navigate("/appointments");
    } catch (error) {
      alert(error.response?.data?.error || "Login gagal");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
