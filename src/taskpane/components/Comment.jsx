import React, { useState } from 'react';
import './Comment.css'; // Import the CSS file

const Comment = () => {
  const [selection, setSelection] = useState('');
  const [word, setWord] = useState('');
  const [comment, setComment] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [commentValue, setCommentValue] = useState('');
  const [enableComment, setEnableComment] = useState(false);

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
    setWord('');
    setComment('');
    setParagraph('');
    setCommentValue('');
  };

  const handleToggleComment = () => {
    setEnableComment(!enableComment);
    setWord('');
  };

  const addCommentsPara = async() => {
    await Word.run(async (context) => {
      const body = context.document.body;
      var paragraphs = body.paragraphs;
      paragraphs.load("items");

      // wait to load the data in the var;
      await context.sync();

      var b = paragraphs.items[paragraph].getRange();

      b.insertComment(commentValue);
    });
  };

  const addCommentsToSearch = async() => {
    await Word.run(async (context) => {
      const results = context.document.body.search(word);
      results.load("length");

      await context.sync();
      for (let i = 0; i < results.items.length; i++) {
        results.items[i].insertComment(comment);
      }
    });
  };

  const addCommentsToSelection = async() => {
    await Word.run(async (context) => {
      context.document.getSelection().insertComment(comment);
    });
  };

  const handleAddComment = () => {
    // Handle adding comment based on the selection
    if (selection === 'text') {
      if(enableComment === true){
        // comment from selection
        addCommentsToSelection();
      } else {
        addCommentsToSearch();
      }
      console.log('Adding comment for text:', enableComment ? '' : word, comment);
    } else if (selection === 'paragraph') {
      addCommentsPara();
    }
  };

  const handleParagraphChange = (e) => {
    let value = e.target.value;
    value = value.replace(/^0+/, '').replace(/\D/g, '');
    value = Math.min(Math.max(value, 0), 4);
    setParagraph(value);
  };

  return (
    <div className="comment-form">
      <div className="select-wrapper">
        <select value={selection} onChange={handleSelectionChange}>
          <option value="">Select...</option>
          <option value="text">Text</option>
          <option value="paragraph">Paragraph</option>
        </select>
      </div>
      {selection === 'text' && (
        <div className="input-wrapper">
          {enableComment && (
            <input
              type="text"
              placeholder="Enter comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          )}
          {!enableComment && (
            <div>
              <input type="text" placeholder="Enter word" value={word} onChange={(e) => setWord(e.target.value)} />
              <input
                type="text"
                placeholder="Enter comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          )}
          <button className="toggle-button" onClick={handleToggleComment}>
            {enableComment ? "Commenting from the selection" : "Comment from the selection"}
          </button>
        </div>
      )}
      {selection === 'paragraph' && (
        <div className="input-wrapper">
          <input
            type="number"
            placeholder="Enter paragraph number"
            value={paragraph}
            onChange={handleParagraphChange}
          />
          <input
            type="text"
            placeholder="Enter comment"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          />
        </div>
      )}
      <button className="add-comment-button" onClick={handleAddComment}>
        Add Comment
      </button>
    </div>
  );
};

export default Comment;
