import React, { useState } from 'react';
import './GenAi.css'; // Import CSS file

const GenAi = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectionData, setSelectionData] = useState('');


  const fetchData = async () => {
    await Word.run(async (context) => {
      var selection = context.document.getSelection();
      context.load(selection, 'text');

      await context.sync();

      setSelectionData(selection.text);

      console.log(selectionData);

      if(selectionData.length === 0){
        return;
      }

      const token = '';
      const baseUrl = '';

      var bodyParams = {
        'text': selectionData
      };

      var queryString = new URLSearchParams(bodyParams).toString();
      var url = `${baseUrl}?${queryString}`;

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyParams)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setResponseData(data.text);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    });
  };

  return (
    <div>
      <button className="button" onClick={fetchData}>Summarize Data</button>
      {responseData && (
        <div className="response-container">
          <h2>Response Data:</h2>
          <pre className="response-data">{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GenAi;
