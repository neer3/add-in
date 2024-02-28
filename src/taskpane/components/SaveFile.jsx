import React, { Component } from "react";

class SaveFile extends Component {

  saveCopy = async () => {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");

      await context.sync();

      var original_content = body.getReviewedText(Word.ChangeTrackingVersion.original);
      var current_content = '';

      await context.sync();

      const trackedChanges = body.getTrackedChanges();
      trackedChanges.load();

      if(trackedChanges.length > 0){
        current_content = body.getReviewedText(Word.ChangeTrackingVersion.current);
      }

      await context.sync();

      console.log(current)
    });

  };
  
  render() {
    return (
      <div>
        Save file component
      </div>
    );
  }
}

export default SaveFile;
