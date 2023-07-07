import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";



const Chat = () => {

  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded , setIsLoaded ] = useState(false)  ;

  useEffect(() => {
    const checkLocalStorage = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
        setIsLoaded(true) ;
      }
    };

    checkLocalStorage();
  }, []);


  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);


  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(response.data);
          } catch (error) {
            console.error(error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };

    fetchData();
  }, [currentUser, navigate]);
  


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };









  return (
    <>
      <Container>
        <h1 style={{color:"white"}}>Chit Chat</h1>
        <div className="container">
          <Contacts 
          contacts = { contacts } 
          // currentUser = { currentUser }
          changeChat = { handleChatChange }  />
          {/* <Contacts contacts = { contacts }  /> */}

             {isLoaded && currentChat === undefined ? (
               <Welcome />
             ) : (
              //  <ChatContainer currentChat={currentChat} socket={socket} />
              <ChatContainer currentChat={currentChat}  currentUser = { currentUser } socket={socket} />

             )}
          
        </div>
        {/* <Profile currentUser = { currentUser } socket={socket} /> */}
      </Container>
    </>
  );
}




const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  // background-color: #131324;
  // background : url("../assets/chatback") ;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    // background-color: blue ;
    // background : url("../assets/chatback") ;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  .theme-light {
    /* Styles for the light theme */
    background-color: #ffffff;
    color: #000000;
  }
  
  .theme-dark {
    /* Styles for the dark theme */
    background-color: #1a1a1a;
    color: #ffffff;
  }
`;

export default Chat
