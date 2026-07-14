import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const fetchUserName = async () => {
      const storedData = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      if (storedData && storedData.username) {
        setUserName(storedData.username);
      }
    };
    fetchUserName();
  }, []);

  return (
    <Container>
      <img src={Robot} alt="Robot" className="robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #080420;
  color: white;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;

  .robot {
    width: min(320px, 70%);
    height: auto;
    margin-bottom: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  }

  h1 {
    margin: 0;
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 1.3;
    word-break: break-word;
  }

  span {
    color: #4e0eff;
  }

  h3 {
    margin-top: 1rem;
    font-size: 1.1rem;
    color: #d1d5db;
    font-weight: 400;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .robot {
      width: 400px;
    }

    h1 {
      font-size: 3rem;
    }

    h3 {
      font-size: 2rem;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem;

    .robot {
      width: 300px;
      margin-bottom: 1.2rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 0.9rem;
      padding: 0 0.5rem;
    }
  }

  /* Very Small Phones */
  @media (max-width: 480px) {
    .robot {
      width: 200px;
    }

    h1 {
      font-size: 1.2rem;
    }

    h3 {
      font-size: 0.8rem;
    }
  }
`;