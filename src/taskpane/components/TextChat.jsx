import React, { useState } from 'react';
import PropTypes from 'prop-types'


function TextChat(props) {
    const [inputValue, setInputValue] = useState('');

    const scrollToParagraph = async() => {
        await Word.run(async (context) => {
          const paragraphs = context.document.body.paragraphs;
          paragraphs.load("items, count");
      
          await context.sync();
          if (inputValue < 0 || inputValue >= paragraphs.count) {
            console.error("Invalid paragraph index.");
            return;
          }
      
          const targetParagraph = paragraphs.items[inputValue];
          targetParagraph.getRange().select();
          targetParagraph.getRange().scrollIntoView();
      
          await context.sync();
        });
      }
  return (
    <div>TextChat
        <input
          id="input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input-box"
        />
        <button onClick={scrollToParagraph} className="find-button">Find</button>
    </div>
  )
}

TextChat.propTypes = {}

export default TextChat
