import React, { useState } from "react";
import PropTypes from "prop-types";
import './Auth.css'
import Header from "./Header";

const AuthPage = ({ onAuthenticate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     // Here, you would typically perform authentication logic,
//     // such as making API calls to validate the username and password.
//     // For simplicity, I'll just check if the username and password match "admin".
//     if (username === "admin" && password === "admin") {
//       // Call the onAuthenticate callback to notify the parent component that authentication is successful.
//       onAuthenticate();
//     } else {
//       alert("Invalid username or password");
//     }
//   };
  const handleLogin = async() => {
    await Word.run(async (context) => {
      Office.context.ui.displayDialogAsync('https://localhost:3000/login.html', {height: 30, width: 20}, (asyncResult) => {
        const dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
            debugger;
            dialog.close();
            processMessage(arg);
        });
      })
    });
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
