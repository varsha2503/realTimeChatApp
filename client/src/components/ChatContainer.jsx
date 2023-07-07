import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);

  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const currentTime = new Date().toLocaleString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        // Handle any errors here
      }
    };

    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    const timestamp = new Date();
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      timestamp,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      timestamp,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, timestamp });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUsernameClick = () => {
    const messageContent = (
      <div>
        <h2 style={{ color: 'black', fontSize: '30px', fontWeight: "bolder", marginLeft: "90px" }}>Profile</h2>
        <div className="avatar">
          <img
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt="No Avatar"
          />
        </div>
        <div className="username">
          <div style={{ color: 'black', fontSize: '23px', fontWeight: "bolder" }}>{currentChat.username}</div>
        </div>
      </div>
    );

    toast.info(messageContent, { autoClose: 3000, icon: false });
  };

  useEffect(() => {
    const usernameElement = document.getElementById("cusername");
    if (usernameElement) {
      usernameElement.addEventListener("click", handleUsernameClick);
    }

    return () => {
      if (usernameElement) {
        usernameElement.removeEventListener("click", handleUsernameClick);
      }
    };
  }, [currentChat]);



  return (
    <>
      <Container>
        <div className="chat-header">
          <div className="user-details">
            {currentChat ? (
              <>
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3 id="cusername">{currentChat.username}</h3>
                </div>
              </>
            ) : null}
          </div>
          <Logout />
        </div>
        <div className="chat-messages" >
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${message.fromSelf ? "sended" : "recieved"
                    }`}
                >
                  <div className="content">
                    <p>{message.message}</p>
                    {/* <span className="timestamp">{message.timestamp}</span> */}
                    <p style = {{fontSize : "10px" , }}>
                      {/* Received Time:{" "} */}
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
        <ToastContainer />
      </Container>
    </>
  );
}


const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar {
          img {
            height: 3rem;
          }
        }
        .username {
          h3 {
            color: white;
          }
        }
      }
    }
    .chat-messages {
      padding: 1rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .message {
        display: flex;
        align-items: center;
        .content {
          max-width: 40%;
          overflow-wrap: break-word;
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 1rem;
          color: #d1d1d1;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
          }
        }
      }
      .sended {
        justify-content: flex-end;
        .content {
          // background-color: #4f04ff21;
          background-color: #00008B
        }
      }
      .recieved {
        justify-content: flex-start;
        .content {
          // background-color: #9900ff20;
          background-color: #8A2BE2 ;
        }
      }
    }
  
    #cusername {
      cursor: pointer;
    }
  `;

