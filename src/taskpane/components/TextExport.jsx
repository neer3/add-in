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

  const handleParentTextRead = async () => {
  Word.run(async (context) => {
    // Get the paragraphs of the document body
    const paragraphs = context.document.body.paragraphs;
    paragraphs.load("text, range");

    // Load revisions for each paragraph
    const revisions = context.document.body.paragraphs.load("revisions");

    // Synchronize the document state with the host application
    await context.sync();

    // Define the revision number to extract text from
    const targetRevisionNumber = 1;

    let textFromRevision = "";

    // Iterate through the paragraphs
    for (let i = 0; i < paragraphs.items.length; i++) {
        const paragraph = paragraphs.items[i];
        const range = paragraph.getRange();

        // Load the revisions for the paragraph
        range.load("revisions");

        // Synchronize the range state with the host application
        await context.sync();

        // Check if the paragraph has the target revision number
        if (range.revisions.items.some(revision => revision.index === targetRevisionNumber)) {
            // Append the text of the paragraph to the extracted text
            textFromRevision += paragraph.text;
        }
    }

    // Do something with the text extracted from the specified revision
    console.log("Text from Revision " + targetRevisionNumber + ":", textFromRevision);
});

  };
  const handleGetMetadata = async () => {
    Word.run(async (context) => {

      const builtInProperties = context.document.properties;
      builtInProperties.load("*"); // Let's get all!
  
      await context.sync();
      // const revnum=builtInProperties.revisionNumber;

      // console.log(JSON.stringify(builtInProperties, null, 4));
      setText(JSON.stringify(builtInProperties, null, 4));
      setIsOpen(true);
  });
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Button
        className={styles.button}
        appearance="primary"
        disabled={false}
        size="large"
        onClick={handleGetMetadata}
      >
        Get Metadata
      </Button>
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
      {/* <Button
        className={styles.button}
        appearance="primary"
        disabled={false}
        size="large"
        onClick={handleParentTextRead}
      >
        Parent Content
      </Button> */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            {text.substring(0, 800)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExport;
