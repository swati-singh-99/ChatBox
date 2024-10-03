import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../Utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Check if the user is logged in
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!storedUser) {
        navigate("/login"); // Navigate to login if not logged in
      } else {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    
    fetchCurrentUser();
  }, [navigate]);

  // Initialize socket and emit event after setting currentUser
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Fetch contacts for the current user
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(response.data);
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        } else {
          navigate("/profile"); // Navigate to set avatar if not set
        }
      }
    };

    fetchContacts();
  }, [currentUser, navigate]);

  // Handle chat selection
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5; /* Lighter background for the page */

  .container {
    height: 100vh;
    width: 100vw;
    background-color: #ffffff; /* White background for the chat container */
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Softer shadow */
    overflow: hidden;
    padding: 20px; /* Add some padding for a neat layout */

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: 100%;
    }
  }

  /* Hide scrollbar */
  .container::-webkit-scrollbar {
    display: none;
  }

  
  .container {
    scrollbar-width: none;
  }

  
  .contacts {
    background-color: #f7f8fc; /* Light gray for the contacts panel */
    border-right: 1px solid #e0e0e0; /* Subtle border for separation */
  }

  .chat-area {
    background-color: #ffffff;
  }

  /* Adding hover effect on contacts */
  .contacts .contact-item:hover {
    background-color: #e0e7ff; /* Light blue on hover */
    cursor: pointer;
  }
`;
