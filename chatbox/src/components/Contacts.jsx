import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import { Search, Settings } from "lucide-react";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY),
    );

    if (data) {
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    }
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
<<<<<<< HEAD
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
              <span className="label">
                  You <span className="arrow">→</span>
              </span>
=======
    <Container>
      {/* Header */}

      <div className="sidebar-header">
        <div className="logo">
          <img src={Logo} alt="" />
          <h2>ChatBox</h2>
        </div>

        <button className="settings-btn">
          <Settings size={18} />
        </button>
      </div>

      {/* Search */}

      <div className="search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Contacts */}

      <div className="contacts">
        {filteredContacts.map((contact, index) => (
          <div
            key={contact._id}
            className={`contact ${currentSelected === index ? "selected" : ""}`}
            onClick={() => changeCurrentChat(index, contact)}
          >
>>>>>>> fe6d403 (updated UI)
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                alt=""
              />
              <span className="status"></span>
            </div>

            <div className="info">
              <h3>{contact.username}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Current User */}

      <div className="current-user">
        <div className="avatar">
          <img src={currentUserImage} alt="" />
        </div>

        <div className="info">
          <h3>{currentUserName}</h3>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 70px 75px 1fr 85px;
  background: #111827;
  border-right: 1px solid #1f2937;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  /* HEADER */

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.2rem;
    border-bottom: 1px solid #1f2937;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    img {
      width: 42px;
      height: 42px;
      object-fit: contain;
    }

    h2 {
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  }

  .settings-btn {
    width: 38px;
    height: 38px;
    border: none;
    outline: none;
    border-radius: 10px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: 0.25s;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: #1f2937;
      color: white;
    }
  }

  /* SEARCH */

  .search {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin: 1rem;
    padding: 0 0.9rem;
    border-radius: 12px;
    background: #1f2937;
    color: #94a3b8;

    input {
      flex: 1;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: white;
      font-size: 0.95rem;

      &::placeholder {
        color: #94a3b8;
      }
    }
  }

  /* CONTACTS */

  .contacts {
    overflow-y: auto;
    padding: 0.5rem;
    background: white;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #a7a7a9;
      border-radius: 20px;
    }
  }

  .contact {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0.8rem;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    margin-bottom: 0.35rem;

    &:hover {
      background: #1f2937;
      color: white;
    }

    .avatar {
      position: relative;
      flex-shrink: 0;

      img {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .info {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 0.98rem;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        margin-top: 4px;
        color: #94a3b8;
        font-size: 0.8rem;
      }
    }
  }

  .selected {
    background: #2563eb;

    &:hover {
      background: #2563eb;
    }

    .info h3,
    .info p {
      color: white;
    }

    .avatar img {
      border: 2px solid white;
    }
  }

  /* CURRENT USER */

  .current-user {
    border-top: 1px solid #1f2937;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 15px;
    background: #0f172a;

    .avatar img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid white;
      object-fit: cover;
    }

    .info {
      flex: 1;

      h3 {
        color: white;
        margin: 0;
        font-size: 1rem;
      }
    }
  }

  @media (max-width: 768px) {
    grid-template-rows: 60px 60px 1fr 70px;

    .sidebar-header {
      padding: 0 0.6rem;
    }

    .logo {
      gap: 0.4rem;

      img {
        width: 34px;
        height: 34px;
      }

      h2 {
        font-size: 0.9rem;
      }
    }

    .settings-btn {
      width: 32px;
      height: 32px;
      min-width: 32px;
      padding: 0;

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .search {
      margin: 0.6rem;
      padding: 0 0.6rem;
      gap: 0.5rem;
      height: 42px;

      svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      input {
        width: 100%;
        min-width: 0;
        font-size: 0.85rem;
      }
    }

    .contact {
      padding: 0.7rem;
      gap: 10px;

      .avatar img {
        width: 46px;
        height: 46px;
      }

      .info h3 {
        font-size: 0.9rem;
      }
    }

    .current-user {
      padding: 0 0.8rem;

      .avatar img {
        width: 45px;
        height: 45px;
      }

<<<<<<< HEAD
    .label {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background-color: #f0edff;
    color: #6b4eff;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    box-shadow: inset 0 0 2px #dedcff;

    .arrow {
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s ease-in-out;
    }

    &:hover .arrow {
      transform: translateX(3px);
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
=======
      .info h3 {
        font-size: 0.9rem;
>>>>>>> fe6d403 (updated UI)
      }
    }
  }

  @media (max-width: 1024px) {
    grid-template-rows: 65px 65px 1fr 80px;

    .sidebar-header {
      padding: 0 0.8rem;
    }

    .logo img {
      width: 36px;
      height: 36px;
    }

    .logo h2 {
      font-size: 1rem;
    }

    .contact {
      padding: 0.7rem;
      gap: 10px;
    }

    .contact .avatar img {
      width: 46px;
      height: 46px;
    }

    .contact .info h3 {
      font-size: 0.9rem;
    }

    .current-user .avatar img {
      width: 46px;
      height: 46px;
    }

    .current-user .info h3 {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    grid-template-rows: 60px 60px 1fr 70px;

    .sidebar-header {
      padding: 0 0.6rem;
    }

    .logo {
      gap: 0.4rem;
    }

    .logo img {
      width: 32px;
      height: 32px;
    }

    .logo h2 {
      font-size: 0.9rem;
    }

    .settings-btn {
      width: 32px;
      height: 32px;
    }

    .search {
      margin: 0.6rem;
      padding: 0 0.6rem;

      input {
        font-size: 0.85rem;
      }
    }

    .contact {
      padding: 0.55rem;
      gap: 8px;
    }

    .contact .avatar img {
      width: 40px;
      height: 40px;
    }

    .contact .info h3 {
      font-size: 0.82rem;
    }

    .current-user {
      padding: 0 0.7rem;
    }

    .current-user .avatar img {
      width: 40px;
      height: 40px;
    }

    .current-user .info h3 {
      font-size: 0.82rem;
    }
  }
`;
