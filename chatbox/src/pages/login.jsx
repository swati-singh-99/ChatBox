import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import hello from "../assets/hello.png";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../Utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "top-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
            <img src={Logo} alt="logo" />
            <h1>chatbox</h1>
            <div className="welcome">
            <h2>Welcome </h2>
            <img src={hello} alt="emoji" className="helloemoji" />
            </div>
            <h3>Fill in the details to log in to your account!</h3>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/signup">SIGNUP</Link>
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
  gap: 2rem;
  align-items: center;
  background: linear-gradient(135deg, #f0f4ff 40%, #e1eaff 100%);
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;

  .brand {
    display: flex;
    flex-direction: column; 
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    
    img {
      height: 4.5rem;
    }

    h1 {
      color: #4a4e69;
      font-size: 2.5rem;
      letter-spacing: 0.15rem;
      text-transform: uppercase;
    }

    .welcome {
      display: flex;
      align-items: center; /* Centers the emoji and h2 vertically */
      gap: 0.5rem; /* Space between h2 and emoji */
    }

    .helloemoji {
      height: 3rem;
    }

    h2 {
      color: #4a4e69;
      font-size: 1.7rem;
      letter-spacing: 0.1rem;
    }

      h3 {
      color: #4a4e69;
      font-size: 1rem;
      justify-content:center;
      text-align:center;
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
    width: 90%; /* Increased the width to 90% */
    max-width: 700px; /* Increased the max width */
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
    padding: 1rem 3rem;
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
