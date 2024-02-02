import React, { useState } from 'react';
import './FindComponent.css'; // Import CSS file for styling

const FindComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [index, setIndex] = useState(0);

  const handleFind = async() => {
    // Perform find operation here
    console.log('Find value:', inputValue);

    await Word.run(async (context) => {
      const results = context.document.body.search(inputValue);
      results.load("length");

      await context.sync();
      if (index < results.items.length){
        results.items[index].font.highlightColor = "yellow";
        results.items[index].select();
        results.items[index].getRange().scrollIntoView();
      }
      // for (let i = 0; i < results.items.length; i++) {
      //   results.items[i].font.highlightColor = "yellow";
      // }
      // Navigate to the first search result
    

    await context.sync();
    });
  };

  const handleNext = () =>{
    setIndex(index + 1);
    handleFind();
  }

  const handleBack = () =>{
    setIndex(index - 1);
    handleFind();
  }

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
    setIndex(0)
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
        <button onClick={handleBack} className="find-button">Back</button>
        <button onClick={handleNext} className="find-button">Next</button>
        <button onClick={resetHighlight} className="reset-button">Reset</button>
      </div>
    </div>
  );
};

export default FindComponent;
