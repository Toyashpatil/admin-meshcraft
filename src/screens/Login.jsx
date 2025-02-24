import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';
import logo from "../assets/Horizontalwithbgsmall.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [feedback, setFeedback] = useState({ error: null, success: null });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: null, success: null });

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setFeedback({ error: data.message || "Login failed", success: null });
      } else {
        setFeedback({ error: null, success: data.message || "Login successful!" });
            
        localStorage.setItem("token", data.token);
        console.log("Login successful", data);
     
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error) {
      setFeedback({ error: "Server error, please try again later.", success: null });
      console.error("Error during login", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 p-4">
      <img
        src={logo}
        alt="Meshcraft Logo"
        className="w-64 md:w-80 mb-6"
      />
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Welcome to Admin Dashboard
          </h1>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          {feedback.error && (
            <p className="text-red-500 text-center text-sm">{feedback.error}</p>
          )}
          {feedback.success && (
            <p className="text-green-500 text-center text-sm">{feedback.success}</p>
          )}
          <button
            type="submit"
            className="relative w-full px-4 md:px-6 py-3 cursor-pointer text-white font-semibold rounded-full bg-gray-900 border-2 border-orange-400 shadow-[0_0_10px_rgba(255,165,0,0.8)] hover:shadow-[0_0_20px_rgba(255,165,0,1)] transition-all duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/" className="text-orange-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
