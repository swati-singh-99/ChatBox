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
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  background-color: #080420;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }

  img {
    height: 20rem;
    margin-bottom: 2rem; /* Add space below the image */
    border-radius: 10%; /* Rounded corners for the image */
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); /* Subtle shadow */
  }

  h1 {
    font-size: 2.5rem; /* Larger font size for the main welcome message */
    margin: 0; /* Remove default margin */
  }

  span {
    color: #4e0eff; /* Highlight username */
  }

  h3 {
    font-size: 1.2rem; /* Slightly larger font size for instructions */
    margin-top: 1rem; /* Add space above the instruction text */
    color: #e0e0e0; /* Light gray for better contrast */
  }

  @media screen and (max-width: 720px) {
    h1 {
      font-size: 2rem; /* Responsive font size */
    }
    h3 {
      font-size: 1rem; /* Responsive font size for instructions */
    }
  }
`;