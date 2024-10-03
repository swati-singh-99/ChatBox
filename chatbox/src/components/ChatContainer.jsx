import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, deleteMessageRoute } from "../Utils/APIRoutes";
import { FaTrash } from "react-icons/fa"; // Import Font Awesome Trash Icon

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const storedData = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      if (storedData && currentChat) {
        try {
          const response = await axios.post(recieveMessageRoute, {
            from: storedData._id,
            to: currentChat._id,
          });

          // Log response to see if _id is present
          console.log("Messages received:", response.data);
          setMessages(response.data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const storedData = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (storedData) {
      try {
        // Emit message to socket
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: storedData._id,
          msg,
        });

        // Send message to the server
        const response = await axios.post(sendMessageRoute, {
          from: storedData._id,
          to: currentChat._id,
          message: msg,
        });

        console.log("Message sent response:", response.data); // Log response for debugging

        // Update messages state
        setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
      }
    }
};


const handleDeleteMsg = async (messageId) => {
  try {
    console.log("Deleting message with ID:", messageId);
    const response = await axios.delete(`${deleteMessageRoute}/${messageId}`);
    console.log("Message deleted response:", response.data); // Log response for debugging
    setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));
    alert("Message deleted successfully.");
  } catch (error) {
    console.error("Failed to delete message:", error.response?.data || error.message);
    alert("Failed to delete message.");
  }
};

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      {currentChat ? (
        <>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div ref={scrollRef} key={message._id}> {/* Use message._id for the key */}
                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                  <div className="content">
                    <p>{message.message}</p>
                    {/* Add delete icon */}
                    {message.fromSelf && (
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDeleteMsg(message._id)} // Handle delete on click
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </>
      ) : (
        <h3>Please select a chat to start messaging.</h3>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 15% 75% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (max-width: 720px) {
    grid-template-rows: 10% 80% 10%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem;
    margin: 0.5rem 0;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border-bottom: 2px solid #ffffff50;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 9;

    @media screen and (max-width: 720px) {
      padding: 1.5rem 1.5rem;
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .avatar {
        img {
          height: 2rem;
          width: 2rem;
          border-radius: 50%;
          border: 2px solid white;
        }
      }

      .username {
        h3 {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;

          @media screen and (max-width: 720px) {
            font-size: 1rem;
          }
        }
      }
    }
  }

  .chat-messages {
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .content {
        max-width: 90%; /* Increased to avoid overflow */
        overflow-wrap: break-word; /* Break long words */
        word-wrap: break-word;
        word-break: break-word; /* Break long words */
        white-space: normal; /* Ensure normal word wrapping */
        padding: 0.5rem;
        font-size: 0.9rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        position: relative; /* Required for the delete icon positioning */

        @media screen and (max-width: 720px) {
          max-width: 85%; /* Adjusted for smaller screens */
          font-size: 0.85rem;
        }

        /* Show delete icon on hover */
        &:hover .delete-icon {
          display: inline; /* Show the delete icon */
        }
      }

      .delete-icon {
        display: none; /* Hide by default */
        font-size: 0.6rem; 
        cursor: pointer;
        margin-left: 0.5rem;
        transition: color 0.3s ease;
        flex-shrink: 0; /* Prevents icon from shrinking if the message is long */
        align-self: center; 

        @media screen and (max-width: 720px) {
          font-size: 0.6rem; /* Keep it the same for mobile, adjust if necessary */
        }
      }  
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4caf50;
        color: white;
        border: 1px solid #388e3c;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        white-space: normal;
        overflow-y: auto;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #2196f3;
        color: white;
        border: 1px solid #1976d2;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        white-space: normal;
      }
    }
  }
`;
