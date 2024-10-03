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
  display: flex;
  align-items: center;
  padding: 10px;

  .button-container {
    display: flex;
    align-items: center;
    position: relative;

    .emoji-picker {
      position: absolute;
      bottom: 50px;
      z-index: 100;
    }

    .emoji {
      font-size: 24px;
      cursor: pointer;
      color: #f4c512;
      padding: 10px 10px;
    }
  }

  .input-container {
    flex-grow: 1;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    button {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
`;
