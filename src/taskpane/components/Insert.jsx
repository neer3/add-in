import React, { useState } from 'react';
import './Insert.css'; // Import CSS file for styling

const Insert = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [firstInputValue, setFirstInputValue] = useState('');
  const [secondInputValue, setSecondInputValue] = useState('');

  const handleInsert = async() => {
    // Perform insertion logic here
    console.log('Selected option:', selectedOption);
    console.log('First input value:', firstInputValue);
    console.log('Second input value:', secondInputValue);

    await Word.run(async (context) => {
      if(selectedOption === "start"){
        context.document.body.paragraphs.getFirst().insertText(firstInputValue, "Start");
      } else if (selectedOption === "end") {
        context.document.body.paragraphs.getLast().insertText(firstInputValue, "End");
      } else if (selectedOption === "middle") {
        var a = context.document.body.paragraphs;
        context.load(a, ['items', 'text']);

        await context.sync();
        a.items[secondInputValue].insertParagraph(firstInputValue, Word.InsertLocation.after);

        await context.sync();
      }
    });

    // Reset the input fields after insertion
    setSelectedOption('');
    setFirstInputValue('');
    setSecondInputValue('');
  };

  const handleFirstInputChange = (e) => {
    setFirstInputValue(e.target.value);
  };

  const handleSecondInputChange = (e) => {
    let value = e.target.value;
    value = value.replace(/^0+/, '').replace(/\D/g, '');
    value = Math.min(Math.max(value, 0), 4);

    setSecondInputValue(value);
  };

  const renderInputBoxes = () => {
    if (selectedOption === 'middle') {
      return (
        <div>
          <div className="form-group">
            <label htmlFor="firstInput">Text to insert:</label>
            <input
              id="firstInput"
              type="text"
              value={firstInputValue}
              onChange={handleFirstInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="secondInput">Insert after which paragraph index</label>
            <input
              id="secondInput"
              type="number"
              min="0"
              max="4"
              value={secondInputValue}
              onChange={handleSecondInputChange}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label htmlFor="input">Text to insert:</label>
        <input
          id="input"
          type="text"
          value={firstInputValue}
          onChange={handleFirstInputChange}
        />
      </div>
    );
  };

  return (
    <div className="my-component">
      <div className="form-group">
        <label htmlFor="selectOption">Select Option:</label>
        <select
          id="selectOption"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select Option</option>
          <option value="start">Start</option>
          <option value="middle">Middle</option>
          <option value="end">End</option>
        </select>
      </div>
      {renderInputBoxes()}
      <button className="insert-button" onClick={handleInsert}>Insert</button>
    </div>
  );
};

export default Insert;
