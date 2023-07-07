import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {

    const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert("form") ;
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };
    return (
        <>
            <FormContainer>
                <div class="wrapper">
                    <div class="form-wrapper sign-up" id="sign_up_form" >
                        <form action="" onSubmit={(event) => handleSubmit(event)}>
                            {/* <form action=""  > */}
                            <h2>Sign Up</h2>
                            <div class="input-group">
                                <input
                                    type="text"
                                    name="username"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                                <label for="">Username</label>
                            </div>
                            <div class="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                                <label for="">Email</label>
                            </div>
                            <div class="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                                <label for="">Password</label>
                            </div>
                            <div class="input-group">
                                <input
                                    type="Password"
                                    name="confirmPassword"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                                <label for="">Confirm Password</label>
                            </div>
                            <button type="submit" class="btn">Sign Up</button>
                            <div class="sign-link">
                                <p>Already have an account? <Link to="/login" className="signIn-link">Sign In</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </FormContainer>
            <ToastContainer />
        </>
    );
}
    

const FormContainer = styled.div`
    .wrapper {
        position: relative;
        width: 400px;
        height: 500px;
    }
    
    .form-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #02022e;
        box-shadow: 0 0 10px rgba(0, 0, 0, .2);
        border-radius: 10px ;
    }
    
    // .wrapper.animate-signUp .form-wrapper.sign-in {
    //     transform: rotate(7deg);
    //     animation: animateRotate .7s ease-in-out forwards;
    //     animation-delay: .3s;
    // }
    
    // .wrapper.animate-signIn .form-wrapper.sign-in {
    //     animation: animateSignIn 1.5s ease-in-out forwards;
    // }
    
    // @keyframes animateSignIn {
    //     0% {
    //         transform: translateX(0);
    //     }
    
    //     50% {
    //         transform: translateX(-500px);
    //     }
    
    //     100% {
    //         transform: translateX(0) rotate(7deg);
    //     }
    // }
    
    // .wrapper .form-wrapper.sign-up {
    //     transform: rotate(7deg);
    // }
    
    // .wrapper.animate-signIn .form-wrapper.sign-up {
    //     animation: animateRotate .7s ease-in-out forwards;
    //     animation-delay: .3s;
    // }
    
    // @keyframes animateRotate {
    //     0% {
    //         transform: rotate(7deg);
    //     }
    
    //     100% {
    //         transform: rotate(0);
    //         z-index: 1;
    //     }
    // }
    
    // .wrapper.animate-signUp .form-wrapper.sign-up {
    //     animation: animateSignUp 1.5s ease-in-out forwards;
    // }
    
    // @keyframes animateSignUp {
    //     0% {
    //         transform: translateX(0);
    //         z-index: 1;
    //     }
    
    //     50% {
    //         transform: translateX(500px);
    //     }
    
    //     100% {
    //         transform: translateX(0) rotate(7deg);
    //     }
    // }
    
    h2 {
        font-size: 30px;
        color: #ffffff;
        text-align: center;
    }
    
    .input-group {
        position: relative;
        width: 320px;
        margin: 30px 0;
    }
    
    .input-group label {
        position: absolute;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        font-size: 16px;
        color: #ffffff;
        padding: 0 5px;
        pointer-events: none;
        transition: .5s;
    }
    
    .input-group input {
        width: 100%;
        height: 40px;
        font-size: 16px;
        color: #ffffff;
        padding: 0 10px;
        background: transparent;
        border: 1px solid #333;
        outline: none;
        border-radius: 5px;
    }
    
    .input-group input:focus~label,
    .input-group input:valid~label {
        top: 0;
        font-size: 12px;
        background: #02022e;
    }
    
    .forgot-pass {
        margin: -15px 0 15px;
    }
    
    .forgot-pass a {
        color: #ffffff;
        font-size: 14px;
        text-decoration: none;
    }
    
    .forgot-pass a:hover {
        text-decoration: underline;
    }
    
    .btn {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background: linear-gradient(to right, #642e9d, #34a7af);
        box-shadow: 0 2px 10px rgba(0, 0, 0, .4);
        font-size: 16px;
        color: #fff;
        font-weight: 500;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        outline: none;
    }
    
    .sign-link {
        font-size: 14px;
        text-align: center;
        margin: 25px 0;
    }
    
    .sign-link p {
        color: #ffffff;
    }
    
    .sign-link p a {
        color: #e91e63;
        text-decoration: none;
        font-weight: 600;
    }
    
    .sign-link p a:hover {
        text-decoration: underline;
    }
    `;

export default Register
