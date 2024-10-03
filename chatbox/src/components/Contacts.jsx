import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        setCurrentUserName(parsedData.username);
        setCurrentUserImage(parsedData.avatarImage);
      }
    };
    fetchUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>CHATBOX</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto; /* Allow header to auto size */
  overflow: hidden;
  background-color: #f7f8fc; /* Light background for the contacts container */
  border-right: 1px solid #e0e0e0; /* Subtle border separating from chat area */
  
  .brand {
    display: flex;
    align-items: center; 
    justify-content: center;
    margin: 10px 10px;
    img {
      height: 2.5rem; /* Reduced height for logo on smaller screens */
      margin-right: 10px; /* Spacing between logo and text */
    }
    h3 {
      color: #333333;
      text-transform: uppercase;
      font-size: 1.5rem; /* Responsive font size */
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.30rem;
    padding: 10px 0;


    &::-webkit-scrollbar {
      width: 0.3rem;
      &-thumb {
        background-color: #d3d3d3; /* Light scrollbar color */
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff; /* White background for contact items */
      min-height: 4rem;
      cursor: pointer;
      width: 80%;
      border-radius: 0.5rem;
      padding: 0.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
      
      &:hover {
        background-color: #e0e7ff; /* Light hover effect */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .avatar {
        img {
          height: 2rem;
        }
      }

      .username {
        h3 {
          color: #333333; /* Darker text color for better readability */
        }
      }
    }

    .selected {
      background-color: #e0e2ff; /* Highlighted color for selected contact */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .current-user {
    background-color: #e8e8e8; /* Light background for current user */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 5px;
    border-top: 1px solid #d3d3d3; /* Subtle border */

    .avatar {
      img {
        height: 2rem;
        border-radius: 50%; /* Circular avatar for current user */
        border: 2px solid #9a86f3; /* Border around current user's avatar */
      }
    }

    .username {
      h2 {
        color: #333333; /* Darker text for the username */
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .brand {
      flex-direction: column; /* Stack logo and text on smaller screens */
      h3 {
        font-size: 1.2rem; /* Smaller font size for mobile */
      }
    }
    .contacts {
      gap:0.20rem;
    }
  }
`;
