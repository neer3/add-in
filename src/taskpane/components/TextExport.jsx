import * as React from "react";
import { useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import './Modal.css';

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "20px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "50%",
  },
  button: {
    marginTop: "5px",
  },
});

const TextExport = () => {
  const [text, setText] = useState("Some text.");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleTextRead = async () => {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");

      await context.sync();
      setText(body.text);
      setIsOpen(true);
    });
  };

  const handleTextReadWithoutChange = async () => {
    await Word.run(async (context) => {
      const body = context.document.body;

      body.load("text");

      await context.sync();

      var a = body.getReviewedText(Word.ChangeTrackingVersion.original);

      await context.sync();

      setText(a.value);
      setIsOpen(true);
    });
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Button className={styles.button} appearance="primary" disabled={false} size="large" onClick={handleTextRead}>
        Current Content
      </Button>
      <Button
        className={styles.button}
        appearance="primary"
        disabled={false}
        size="large"
        onClick={handleTextReadWithoutChange}
      >
        Original Content
      </Button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            {text.substring(0, 400)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExport;
