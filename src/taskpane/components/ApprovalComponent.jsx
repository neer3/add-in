import React, { useState } from 'react';
import './ApprovalComponent.css'; // Import CSS file for styling

const ApprovalComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [approvedEntries, setApprovedEntries] = useState([]);
  const [rejectedEntries, setRejectedEntries] = useState([]);
  const [entries, setEntries] = useState([]);
  const [showList, setShowList] = useState(false);

  const currentEntry = entries[currentIndex];

  const fetchEntries = async() => {
    await Word.run(async (context) => {
      var body = context.document.body;
      body.load("text");
      await context.sync();

      body.track();

      context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;
      await context.sync();

      var a = body.getTrackedChanges();

      a.load();

      await context.sync();

      var fetchedEntries = [];

      for (let i = 0; i < a.items.length; i++) {
        var temp = {
          id: i,
          type: a.items[i].type,
          text: a.items[i].text,
          author: a.items[i].author,
          date: a.items[i].date.toDateString(),
        };

        fetchedEntries.push(temp);
      }

      setEntries(fetchedEntries);
    });
  };

  const acceptChange = async(id) => {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.load("length");

      await context.sync();

      var a = body.getTrackedChanges();
      a.load();
      await context.sync();

      if (id < a.items.length) {
        a.items[id].accept();
      } else {
        fetchEntries();
        console.log("All are done");
      }
    });
  };

  const rejectChange = async(id) => {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.load("length");

      await context.sync();

      var a = body.getTrackedChanges();
      a.load();
      await context.sync();

      if (id < a.items.length) {
        a.items[id].reject();
      } else {
        fetchEntries();
        console.log("All are done");
      }
    });
  };

  const approveEntry = () => {
    setApprovedEntries([...approvedEntries, currentEntry]);
    acceptChange(currentEntry.id);
    moveToNextEntry();
  };

  const rejectEntry = () => {
    setRejectedEntries([...rejectedEntries, currentEntry]);
    rejectChange(currentEntry.id);
    moveToNextEntry();
  };

  const moveToNextEntry = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // alert('No more entries to review.');
      setCurrentIndex(0);
    }
  };

  const toggleShowList = () => {
    setShowList(!showList);
  };

  return (
    <div className="approval-component">
      <div className="entry-container">
        {currentEntry && (
          <div>
            <h2>{currentEntry.type}</h2>
            <h4>{currentEntry.author}</h4>
            <h5>{currentEntry.date}</h5>
            <p>{currentEntry.text}</p>
            <div className="button-container">
              <button className="approve-button" onClick={approveEntry}>Approve</button>
              <button className="reject-button" onClick={rejectEntry}>Reject</button>
              <button className="next-button" onClick={moveToNextEntry}>Next</button>
            </div>
          </div>
        )}
        {!currentEntry && (
          <div>
            <p>No more entries to review.</p>
          </div>
        )}
      </div>
      <button className="fetch-button" onClick={fetchEntries}>
        Fetch Entries
      </button>
      <button className="view-list-button" onClick={toggleShowList}>
        {showList ? 'Hide List' : 'Show List'}
      </button>
      {showList && (
        <div className="list-container">
          <h3>Approved Entries:</h3>
          <ul>
            {approvedEntries.map((entry, index) => (
              <li key={index}>{entry.text}</li>
            ))}
          </ul>
          <h3>Rejected Entries:</h3>
          <ul>
            {rejectedEntries.map((entry, index) => (
              <li key={index}>{entry.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApprovalComponent;
