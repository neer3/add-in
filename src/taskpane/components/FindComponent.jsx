import React, { useState } from 'react';
import './FindComponent.css'; // Import CSS file for styling

const FindComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleFind = async() => {
    // Perform find operation here
    console.log('Find value:', inputValue);

    await Word.run(async (context) => {
      const results = context.document.body.search(inputValue);
      results.load("length");

      await context.sync();
      for (let i = 0; i < results.items.length; i++) {
        results.items[i].font.highlightColor = "yellow";
      }
    });
  };

  const resetHighlight = async() => {
    console.log('Find value:', inputValue);

    if(inputValue.length === 0){
      return;
    }

    await Word.run(async (context) => {
      const results = context.document.body.search(inputValue);
      results.load("length");

      await context.sync();
      for (let i = 0; i < results.items.length; i++) {
        results.items[i].font.highlightColor = "white";
      }
    });

    setInputValue('');
  };

  return (
    <div className="find-component">
      <div className="input-container">
        <label htmlFor="input">Find:</label>
        <input
          id="input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input-box"
        />
      </div>
      <div className="button-container">
        <button onClick={handleFind} className="find-button">Find</button>
        <button onClick={resetHighlight} className="reset-button">Reset</button>
      </div>
    </div>
  );
};

export default FindComponent;
