import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import Comment from "./Comment";
import Accordion from "./Accordion";
import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import TextExport from "./TextExport";
import ApprovalComponent from "./ApprovalComponent";
import Insert from "./Insert";
import ReplaceComponent from "./ReplaceComponent";
import FindComponent from "./FindComponent";
import GenAi from "./GenAi";
import Gamma from "./Gamma";
import AuthPage from "./Auth";
import Chat from "./Chat";
import SaveFile from "./SaveFile";
import KeyProvision from "./KeyProvision";
// import TextChat from "./TextChat";

const useStyles = makeStyles({
  root: {
    maxHeight: "100vh",
  },
});

const App = (props) => {
  const styles = useStyles();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`https://gamma-dev.pramata.com/api/auth/token?allow_unpublished=true`, {
      method: "GET",
      credentials: "include",
    })
    .then((resp) => {
      if (resp.status === 200) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        console.log("Authentication failed!");
      }
    })
    .catch((error) => {
      console.error("Error fetching authentication token:", error);
      setAuthenticated(false);
    });
  }, []);

  return (
    <div className={styles.root}>
      {authenticated ? (
      <div>
        <Header
        logo="https://www.pramata.com/wp-content/uploads/2022/12/cropped-Copy-of-pramata-logo-2000px-1.png"
        title={props.title}
        message=""
      />
         <Accordion title="General Actions">
          <div>
            <h5>
              All are straight forward functionalities, here we want to display that we can acheive it via
              the add in.
            </h5>
            <Accordion title="Replace">
              <ReplaceComponent/>
            </Accordion>
            <Accordion title="Find">
              <FindComponent/>
            </Accordion>
            <Accordion title="Insert">
              <div>
                <h5>Inserting any text/paragraph can be in 3 different modes start, end and in middle.</h5>
                <Insert/>
              </div>
            </Accordion>
            <Accordion title="Comment">
              <div>
                <h5>Comment can be added to a selection of text even by matching string/text or a paragraph. </h5>
              </div>
              <div>
                <Comment/>
              </div>
            </Accordion>
            <Accordion title="Accept/Reject">
              <div>
                <h5>User have option to confirming the red lined changes. Once it comfirmed it will be added to the original document.</h5>
              </div>
              <div>
                <ApprovalComponent/>
              </div>
            </Accordion>
            <Accordion title="Original/Current">
              <div><h5>The word document can Exported at the end. Have option to export with or without red lined changes.</h5></div>
              <div><TextExport/></div>
            </Accordion>
          </div>
        </Accordion>
        
        {/* <Accordion title="Chat with GenAI">
          <div><h5>The word document can Exported at the end. Have option to export with or without red lined changes.</h5></div>
          <div><TextChat/></div>
        </Accordion> */}
        {/* <Accordion title="Version Control">
          <SaveFile/>
        </Accordion> */}
        <Accordion title="GenAI">
          {/* <GenAi/> */}
          <Accordion title="Standard Prompts">
          <div><h5>Use Standard Prompt to get key provision from word document</h5></div>
          <KeyProvision/>
          </Accordion>
          <Accordion title="Standard Prompts with Playbook">
          <div><h5>Try different playbooks to get suggestion and enhance the content with "Replace" option</h5></div>
            <Chat/>
          </Accordion>
        </Accordion>
        
        {/* <Accordion title="Gamma">
          <Gamma/>
        </Accordion> */}
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>
      ) : (
        // Render authentication page if not authenticated
        <AuthPage setAuthenticated={setAuthenticated} />
        
      )}
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
