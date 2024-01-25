import * as React from "react";
import { useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import insertText from "../office-document";

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
  }
});

const TextExport = () => {
    const [text, setText] = useState("Some text.");

    const handleTextRead = async () => {
      
      await Word.run(async (context) => {
        const body = context.document.body;
      body.load("text");
  
      await context.sync();
        setText(body.text);
      });
    };
  
    const handleTextReadWithoutChange = async ()=>{
      await Word.run(async (context) => {
        const body = context.document.body;
  
        body.load("text");
  
        await context.sync();
  
        var a = body.getReviewedText(Word.ChangeTrackingVersion.original);
  
        await context.sync();
  
        setText(a.value)
  
      });
    }

  const handleTextChange = async (event) => {
    setText(event.target.value);
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
        The word document can Exported at the end.
        <Button className={styles.button} appearance="primary" disabled={false} size="large" onClick={handleTextRead}>
        Read text content
      </Button>
      <Button className={styles.button} appearance="primary" disabled={false} size="large" onClick={handleTextReadWithoutChange}>
        Read text content without change
      </Button>
      <Field className={styles.textAreaField} size="large" label="Enter text to be inserted into the document.">
        <Textarea size="large" value={text} onChange={handleTextChange} />
      </Field>
    </div>
  );
};

export default TextExport;
