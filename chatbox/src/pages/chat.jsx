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
  background: #f0f2f5;
  overflow: hidden;

  .container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 28% 72%;
    background: #fff;
    overflow: hidden;
  }

  /* Desktop */
  @media (min-width: 1200px) {
    .container {
      grid-template-columns: 25% 75%;
    }
  }

  /* Laptop */
  @media (max-width: 1199px) {
    .container {
      grid-template-columns: 30% 70%;
    }
  }

  /* Tablet */
  @media (max-width: 992px) {
    .container {
      grid-template-columns: 35% 65%;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .container {
      grid-template-columns: 38% 62%;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .container {
      grid-template-columns: 40% 60%;
    }
  }

  .container::-webkit-scrollbar {
    display: none;
  }

  .container {
    scrollbar-width: none;
  }
`;