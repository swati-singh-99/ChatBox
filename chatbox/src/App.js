import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Profile from "./components/profile";

export default function App() {
  return <BrowserRouter>
  <Routes>
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/" element={<Chat />} />
  </Routes>
  </BrowserRouter>

}