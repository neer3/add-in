import React, { useState } from 'react';
import './ReplaceComponent.css'; // Import CSS file for styling

const ReplaceComponent = () => {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const handleReplace = async() => {
    setInputValue1(inputValue2);
    await Word.run(async (context) => {
      const results = context.document.body.search(inputValue1);
      results.load("length");

      await context.sync();
      for (let i = 0; i < results.items.length; i++) {
        results.items[i].font.highlightColor = "yellow";
        results.items[i].insertText(inputValue2, Word.InsertLocation.replace);
      }
    });
  };

  const resetHighlight = async() => {
    console.log('Find value:', inputValue1);

    if(inputValue1.length === 0){
      return;
    }

    await Word.run(async (context) => {
      const results = context.document.body.search(inputValue2);
      results.load("length");

      await context.sync();
      for (let i = 0; i < results.items.length; i++) {
        results.items[i].font.highlightColor = "white";
      }
    });

    setInputValue1('');
    setInputValue2('');
  };

  return (
    <div className="replace-component">
      <div className="input-container">
        <label htmlFor="input1">Find:</label>
        <input
          id="input1"
          type="text"
          value={inputValue1}
          onChange={(e) => setInputValue1(e.target.value)}
          className="input-box"
        />
      </div>
      <div className="input-container">
        <label htmlFor="input2">Replace with:</label>
        <input
          id="input2"
          type="text"
          value={inputValue2}
          onChange={(e) => setInputValue2(e.target.value)}
          className="input-box"
        />
      </div>
      <div>
        <button onClick={handleReplace} className="replace-button">Replace</button>
        <button onClick={resetHighlight} className="reset-button">Reset</button>
      </div>
    </div>
  );
};

export default ReplaceComponent;
