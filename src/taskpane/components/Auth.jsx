import React, { useState } from "react";
import PropTypes from "prop-types";
import './Auth.css'
import Header from "./Header";

const AuthPage = ({ onAuthenticate }) => {
    const setJwtTokenInCookie = (token) => {
        // Set the JWT token in a cookie
        document.cookie = `pramata_add_in_jwt_token=${token}; path=/`;
      };
  const handleLogin = async() => {
    setJwtTokenInCookie("Admin123")
    // await Word.run(async (context) => {
    //   Office.context.ui.displayDialogAsync('https://localhost:3000/login.html', {height: 30, width: 20}, (asyncResult) => {
    //     const dialog = asyncResult.value;
    //     dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
    //         debugger;
    //         dialog.close();
    //         processMessage(arg);
    //     });
    //   })
    // });
    onAuthenticate()
  };

  return (
    <div className="auth-component">
       <img src="https://www.pramata.com/wp-content/uploads/2022/12/cropped-Copy-of-pramata-logo-2000px-1.png" className="logo"/>
      <h2>Welcome to Pramata's</h2>
      <h2>GenAI Assist</h2>
      <p>Get started here</p>
      <div>
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
    </div>
  );
};

AuthPage.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
};

export default AuthPage;
