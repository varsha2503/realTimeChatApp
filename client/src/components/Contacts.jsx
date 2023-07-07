import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import GroupChat from "./GroupChat" ;
import { Button, Modal, Form } from 'react-bootstrap';


const Contacts = ({ contacts, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const [groupname, setGroupName] = useState('');

  const [values, setValues] = useState({
    groupname : "",
    participants : ""
});

const handleChange = (event) => {
  setValues({ ...values, [event.target.name]: event.target.value });
};


  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };

    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };


  const handleClick = () => {
    const handleSubmit = (event) => {
      event.preventDefault();
      // Handle form submission logic
      // You can access the input values with the `email` and `textarea` state variables
      // Close the toast when done
      // toast.dismiss();
    };

    const handleSearch = (event) => {
    };

    const messageContent = (
      <>
        <form>
          <label style={{ fontSize: '35px', fontFamily: 'Work sans', display: 'flex', justifyContent: 'center', color: "black" }}>
            Create Group Chat
          </label>
          <div>
            <label for="" style={{marginTop : "5px"}}>Group Name</label>
            <input style={{
              width: '100%',
              height: '40px',
              fontSize: '16px',
              color: '#ffffff',
              padding: '0 10px',
              background: 'transparent',
              border: '1px solid #333',
              outline: 'none',
              borderRadius: '5px',
              marginBottom : '10px' ,
              color: "black" ,
            }}
              type="text"
              name="groupname"
              // placeholder="Chat Name"
              onChange={(e) => handleChange(e)}
              min="3"
              required
            />
          </div>
          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          </div>
          <button type="button" onClick={handleSubmit}
            style={{
              color: 'blue',
              position: "relative",
              top: "0",
              left: "0",
              width: "100%",
              height: "40px",
              background: "linear-gradient(to right, #642e9d, #34a7af)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, .4)",
              fontSize: "16px",
              color: "#fff",
              fontWeight: "500",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              outline: "none",
            }} >
            Create Chat
          </button>
        </form>
      </>
    );

    toast.info(messageContent, { autoClose: false, icon: false, pauseOnFocusLoss: true, closeOnClick: false });
  };


  return (
    <>
    {/* <ToastContainer /> */}
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            {/* <img src={Logo} alt="logo" /> */}
            <h3 >My Chats</h3>
            <>
              <button onClick={handleClick}>New Group +</button>
              {/* <Button variant="primary" onClick={handleSubmit}>Create Group +</Button> */}
            </>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? 'selected' : ''}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};



const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
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

`;

export default Contacts;
