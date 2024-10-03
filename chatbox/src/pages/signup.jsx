import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/hello.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../Utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-right",
    autoClose: 6000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password should match with Confirfm Password.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 6) {
      toast.error(
        "Password should be equal or greater than 6 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" className="emoji" />
            <h1>chatbox</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Register</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  background: linear-gradient(135deg, #f0f4ff 40%, #e1eaff 100%);
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;

  .brand {
    display: flex;
    flex-direction: column; 
    align-items: center;
    justify-content: center;

    .emoji {
      font-size: 4rem; 
      line-height: 1; 
    }

    img {
      height: 5rem;
    }

    h1 {
      color: #4a4e69;
      font-size: 2.5rem;
      letter-spacing: 0.15rem;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #ffffff;
    border-radius: 1.5rem;
    padding: 3rem 4rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    width: 90%; 
    max-width: 700px; 
    transition: transform 0.2s ease-in-out, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
  }

  input {
    background: #f9f9ff;
    padding: 1rem;
    border: 1px solid #b8c1ec;
    border-radius: 0.6rem;
    color: #4a4e69;
    width: 100%; 
    font-size: 1.1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: #6a82fb;
      box-shadow: 0 0 5px rgba(106, 130, 251, 0.5);
      outline: none;
    }
  }

  button {
    background-color: #6a82fb;
    color: #ffffff;
    padding: 1rem 2rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    width: 100%; /* Full width for buttons */
    box-shadow: 0 4px 10px rgba(106, 130, 251, 0.3);
    
    &:hover {
      background-color: #5a6efb;
      transform: translateY(-4px);
      box-shadow: 0 6px 15px rgba(106, 130, 251, 0.5);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 10px rgba(106, 130, 251, 0.3);
    }
  }

  span {
    color: #4a4e69;
    font-size: 1rem;
    text-align: center;

    a {
      color: #6a82fb;
      text-decoration: none;
      font-weight: 700;
      position: relative;
      transition: color 0.3s ease, border-bottom 0.3s ease;
      text-transform: uppercase;
      &:hover {
        color: #4e5af2;
        border-bottom: 2px solid #4e5af2;
      }

      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #6a82fb;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }

      &:hover:after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }
`;
