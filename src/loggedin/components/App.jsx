import * as React from "react";

const App = () => {
  const handleDialog = async() => {
    await Word.run(async (context) => {
      debugger;
      Office.context.ui.messageParent("DataToPass");
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

export default App;
