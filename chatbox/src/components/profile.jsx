import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { profileRoute } from "../Utils/APIRoutes";

export default function Profile() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }
    };
    checkLocalStorage();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${profileRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error in setting avatar. Please try again.", toastOptions);
      }
    }
  };

  const fetchAvatars = async () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      try {
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
        
        // Add a delay of 1 second between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.response && error.response.status === 429) {
          toast.error("Too many requests. Please try again later.", toastOptions);
          return; 
        }
        console.error("Error fetching avatar:", error);
      }
    }
    setAvatars(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvatars();
  }, [api]);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your Profile Picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background: linear-gradient(100deg, gray, #bbdefb);
  height: 100vh;
  width: 100vw;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: #333;
      font-size: 2rem;
      text-align: center;
      margin-bottom: 1rem;
    }
  }
  
  .avatars {
    display: flex;
    gap: 2rem;
    justify-content: center; // Center avatars horizontally

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 50%; // Make avatar circles
      display: flex;
      justify-content: center;
      align-items: center;
      transition: border-color 0.5s ease-in-out, transform 0.2s ease-in-out;
      cursor: pointer; // Add pointer cursor on hover
      
      img {
        height: 8rem; // Increased size for better visibility
        border-radius: 50%; // Ensure images are circular
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); // Add shadow for depth
        transition: transform 0.3s ease-in-out;
      }
      
      &:hover img {
        transform: scale(1.1); // Scale up on hover
      }
    }
    
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Add shadow for depth
    
    &:hover {
      background-color: #3b5bdb; // Darker on hover
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); // Elevate on hover
      transition: background-color 0.3s ease-in-out; // Smooth transition
    }
  }
`;
