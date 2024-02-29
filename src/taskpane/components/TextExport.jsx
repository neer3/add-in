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

  const documentToCsv = async () => {
    if(calledLLM === true){
      return;
    }

    setCalledLLM(true);
    let csvRows = [];
    csvRows.push('"index","paragraph"');
    await Word.run(async (context) => {
      const body = context.document.body;
      const paragraphs = body.paragraphs;
      paragraphs.load("text");
      await context.sync();
      for (let i = 0; i < paragraphs.items.length && i<40; i++) {
        let paragraph = paragraphs.items[i];
        let text = paragraph.text;
        text = text.replace(/[^a-zA-Z0-9\s]/g, "");
        if (text.length>2){
          let csvRow = i + ',"' + text + '"';
        csvRows.push(csvRow);
        }
      }
    });
  };

  // const handleTextReadDeleted = async () => {
  //   await Word.run(async (context) => {
  //     const body = context.document.body;
  //     const paragraphs = body.paragraphs;
  //     paragraphs.load("text");

  //     var a = body.getTrackedChanges();

  //     a.load();

  //     await context.sync();
  //     var fetchedEntries = [];
  //     for (let i = 0; i < a.items.length; i++) {
  //       if (a.items[i].type === "Deleted"){
  //       var temp = a.items[i];
  //       fetchedEntries.push(temp);
  //       };
  //     };
      
  //     let text=""
  //     for (let i = 0; i < paragraphs.items.length && i<40; i++) {
  //       let paragraphRange = paragraphs.items[i].getRange();
  //       let paragraph=  paragraphs.items[i].getTrackedChanges();
  //       paragraph.load();
  //       let aaa= paragraphs.items[0].getText(
  //         {
  //           IncludeHiddenText: false,
  //           IncludeTextMarkedAsDeleted: false,
  //       }
  //       );
  //       debugger;
  //       await context.sync();

  //       debugger;
  //       for (let i=0; i<fetchedEntries.length;i++){
  //       let b = fetchedEntries[i].getRange();
  //         let a = paragraphRange.compareLocationWith(b);
  //         await context.sync();
  //         debugger;
  //       if (a=="Equal"){
  //           text+= paragraph.text;
  //       }}
  //     };
  //     setText(body.text);
  //     setIsOpen(true);
  //   });
  // };

  const handleTextReadDeleted = async () => {
    await Word.run(async (context) => {
      const body = context.document.body;
      const paragraphs = body.paragraphs;
      paragraphs.load("text");

      await context.sync();
      
      let text=""
      for (let i = 0; i < paragraphs.items.length && i<40; i++) {
        let paragraphWithHiddenText= paragraphs.items[i].getText(
          {
            IncludeHiddenText: false,
            IncludeTextMarkedAsDeleted: false,
        }
        );
        await context.sync();
        text+= paragraphWithHiddenText.value;
      };
      setText(text);
      setIsOpen(true);
    });
  };

  const handleTextReadDeletedIgnore = async () => {
    await Word.run(async (context) => {
      const body = context.document.body;
      const paragraphs = body.paragraphs;
      paragraphs.load("text");

      var a = body.getTrackedChanges();

      a.load();

      await context.sync();
      var fetchedEntries = [];
      for (let i = 0; i < a.items.length; i++) {
        if (a.items[i].type === "Deleted"){
        var temp = a.items[i].text
        fetchedEntries.push(temp);
        };
      };
      debugger
      let text = "";
      for (let i = 0; i < paragraphs.items.length && i < 40; i++) {
        let paragraphText = paragraphs.items[i].text;
        for (let j = 0; j < fetchedEntries.length; j++) {
          if (paragraphText.includes(fetchedEntries[j])) {
            paragraphText = paragraphText.replace(fetchedEntries[j], '');
          }
        }
        text += paragraphText;
      }
      setText(text);
      setIsOpen(true);
    });
  };

  const handleCompare = async () => {
  await Word.run(async (context) => {
    const paragraphs = context.document.body.paragraphs;
    paragraphs.load("items");
  
    await context.sync();
  
    const firstParagraphAsRange = paragraphs.items[0].getRange();
    const secondParagraphAsRange = paragraphs.items[0].getRange();
  
    const comparedLocation = firstParagraphAsRange.compareLocationWith(secondParagraphAsRange);
  
    await context.sync();
  
    console.log(`Location of the first paragraph in relation to the second paragraph: ${comparedLocation.value}`);
  });
}

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
      <Button className={styles.button} appearance="primary" disabled={false} size="large" onClick={handleTextReadDeleted}>
        Current Content with Deleted
      </Button>
      {/* <Button className={styles.button} appearance="primary" disabled={false} size="large" onClick={handleTextReadDeletedIgnore}>
        Current Content with Deleted Ignore
      </Button>
      <Button className={styles.button} appearance="primary" disabled={false} size="large" onClick={handleCompare}>
        Compare content
      </Button> */}
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
