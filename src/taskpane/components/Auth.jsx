import React, { useState } from "react";
import PropTypes from "prop-types";
import './Auth.css'
import App from "./App";

const AuthPage = (props) => {

      const processMessage = (arg) => {
            props.setAuthenticated(true);
      };
    
      const handleLogin = async() => {
        await Word.run(async (context) => {
          Office.context.ui.displayDialogAsync('https://localhost:3000/login.html', {height: 60, width: 20}, (asyncResult) => {
            const dialog = asyncResult.value;
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
                processMessage(arg);
                dialog.close();
            });
            dialog.addEventHandler(Office.EventType.DialogEventReceived, (arg) => {
                if (arg.error) {
                  // Handle error if dialog failed to close
                  console.error('Error closing dialog:', arg.error.message);
                } else {
                  // Redirect to App.jsx after dialog is closed
                  window.location.href="https://localhost:3000/taskpane.html"
                }
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

// AuthPage.propTypes = {
//   onAuthenticate: PropTypes.func.isRequired,
// };

export default AuthPage;
