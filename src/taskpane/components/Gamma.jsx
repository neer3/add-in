import React, { useState } from 'react';

const Gamma = () => {

  const processMessage = (arg) => {
    console.log("here");
  };

  const handleDialog = async() => {
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
    <div className="find-component">
      <div className="button-container">
        <button onClick={handleDialog} className="find-button">Open</button>
      </div>
    </div>
  );
};

export default Gamma;
