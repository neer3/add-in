import React, { useState } from 'react';

const Gamma = () => {

  const processMessage = (arg) => {
    // // Set the query parameters in a cookie
    document.cookie = `pramata_add_in_jwt_token=${arg['message']}; expires=${new Date(Date.now() + 86400e3).toUTCString()}`;
  };

  const handleDialog = async() => {
    await Word.run(async (context) => {
      Office.context.ui.displayDialogAsync('https://localhost:3000/login.html', {height: 30, width: 20}, (asyncResult) => {
        const dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
            dialog.close();
            processMessage(arg);
        });
      })
    });
  };

  return (
    <div className="find-component">
      <div className="button-container">
        <button onClick={handleDialog} className="find-button">Open</button>
      </div>
    </div>
  );
};

export default Gamma;
