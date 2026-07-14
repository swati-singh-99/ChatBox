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
      if (storedData) {
        const response = await axios.post(recieveMessageRoute, {
          from: storedData._id,
          to: currentChat._id,
        });
        
        // Log response to see if _id is present
        console.log(response.data); // Check the structure of the response
        setMessages(response.data);
      }
    };
    

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const storedData = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (storedData) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: storedData._id,
        msg,
      });
      const { data } = await axios.post(sendMessageRoute, {
        from: storedData._id,
        to: currentChat._id,
        message: msg,
      });

      setMessages((prev) => [...prev, data]);
    }
  };

  const handleDeleteMsg = async (messageId) => {
    
    try {
      await axios.delete(`${deleteMessageRoute}/${messageId}`);
      console.log("donee")
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
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
              <div ref={scrollRef} key={message._id}> {/* Use message._id instead of uuidv4() */}
                <div
                  className={`message ${message.fromSelf ? "sended" : "recieved"}`}
                >
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
  grid-template-rows: 75px 1fr 80px;
  height: 100%;
  background: #f3f4f6;
  overflow: hidden;

  /* HEADER */

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 2px 10px rgba(0,0,0,.05);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #2563eb;
        }
      }

      .username {
        display: flex;
        flex-direction: column;

        h3 {
          margin: 0;
          color: #111827;
          font-size: 1.1rem;
          font-weight: 600;
        }

        span {
          color: #10b981;
          font-size: .8rem;
        }
      }
    }
  }

  /* MESSAGES */

  .chat-messages {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: .8rem;
    overflow-y: auto;
    background: #eef2ff;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 20px;
    }

    .message {
      display: flex;

      .content {
        max-width: 65%;
        padding: .8rem 1rem;
        border-radius: 18px;
        position: relative;
        font-size: .95rem;
        line-height: 1.5;
        word-break: break-word;
        display: flex;
        align-items: center;
        gap: .6rem;
        box-shadow: 0 4px 12px rgba(0,0,0,.08);

        p {
          margin: 0;
        }
      }

      .delete-icon {
        opacity: 0;
        cursor: pointer;
        color: #fea8a8;
        transition: .2s;
        font-size: .75rem;
      }

      .content:hover .delete-icon {
        opacity: 1;
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background: #2563eb;
        color: white;
        border-bottom-right-radius: 6px;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background: white;
        color: #111827;
        border-bottom-left-radius: 6px;
      }
    }
  }

  @media (max-width:768px) {
    grid-template-rows: 70px 1fr 75px;

    .chat-header {
      padding: 0 1rem;

      .avatar img {
        width: 42px;
        height: 42px;
      }

      .username h3 {
        font-size: 1rem;
      }
    }

    .chat-messages {
      padding: .8rem;

      .message .content {
        max-width: 80%;
        font-size: .9rem;
      }
    }
  }
`;