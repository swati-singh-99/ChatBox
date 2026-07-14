import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import styled from "styled-components";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(); // Reference for the emoji picker

  // Toggle emoji picker visibility
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji click
  const handleEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false); // Close the picker if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Send chat message
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker" ref={emojiPickerRef}>
              <Picker
                onEmojiClick={handleEmojiClick}
                pickerStyle={{
                  height: "250px", // Adjust the height
                  position: "absolute",
                  bottom: "50px", // Position it above the emoji button
                }}
              />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here....."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  background: #181a20;
  border-top: 1px solid #2b2f3a;
  box-sizing: border-box;

  .button-container {
    position: relative;
    flex-shrink: 0;

    .emoji {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #242833;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #ffd43b;
      transition: 0.3s;

      svg {
        font-size: 1.5rem;
      }

      &:hover {
        background: #313645;
      }
    }

    .emoji-picker {
      position: absolute;
      bottom: 60px;
      left: 0;
      z-index: 100;
      max-width: calc(100vw - 20px);
    }
  }

  .input-container {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    background: #242833;
    border-radius: 30px;
    padding: 0.25rem;

    input {
      flex: 1;
      min-width: 0;
      background: transparent;
      border: none;
      outline: none;
      color: white;
      padding: 0.85rem 1rem;
      font-size: 0.95rem;

      &::placeholder {
        color: #9ca3af;
      }
    }

    button {
      flex-shrink: 0;
      width: 46px;
      height: 46px;
      border: none;
      border-radius: 50%;
      background: #4f46e5;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      svg {
        font-size: 1.2rem;
      }
    }
  }

  /* Tablet */

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.6rem;

    .button-container .emoji {
      width: 40px;
      height: 40px;

      svg {
        font-size: 1.25rem;
      }
    }

    .emoji-picker {
     left:-40px;
    transform: scale(0.7);
    transform-origin: bottom left;
  }

    .input-container {
      border-radius: 24px;

      input {
        padding: 0.7rem;
        font-size: 0.85rem;
      }

      button {
        width: 40px;
        height: 40px;

        svg {
          font-size: 1rem;
        }
      }
    }
  }

  /* Small Mobile */

  @media (max-width: 480px) {
    gap: 0.4rem;
    padding: 0.45rem;

    .button-container .emoji {
      width: 34px;
      height: 34px;

      svg {
        font-size: 1.1rem;
      }
    }
      .emoji-picker {
     left:-40px;
    transform: scale(0.5);
    transform-origin: bottom left;
  }

    .input-container input {
      padding: 0.6rem;
      font-size: 0.7rem;
    }

    .input-container button {
      width: 30px;
      height: 30px;

      svg {
        font-size: 0.95rem;
      }
    }
  }
`;