import React, { useEffect, useState } from 'react';

const App = () => {
  // const [token, setToken] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    // setToken(params['q']);
    // document.cookie = `pramata_add_in_jwt_token=${params['q']}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;
    // debugger;
    handleDialog(params['q']);
  }, []);

  const handleDialog = async(token) => {
    await Word.run(async (context) => {
      Office.context.ui.messageParent(token);
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