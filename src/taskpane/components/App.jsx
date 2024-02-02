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
// import GenAi from "./GenAi";
import Gamma from "./Gamma";
import AuthPage from "./Auth";

const useStyles = makeStyles({
  root: {
    maxHeight: "100vh",
  },
});

const App = (props) => {
  const styles = useStyles();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = document.cookie;
    const jwtToken = cookies.split(';').find(cookie => cookie.trim().startsWith('pramata_add_in_jwt_token='));
    if (jwtToken){
      const token = jwtToken.split('=')
      // const jwtToken = Office.context.document.settings.get('pramata_add_in_jwt_token');
  
      if (token[1]=='some_random_token') {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        console.log('Authentication failed!');
      }
    }
   
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
        <Accordion title="Replace/Find">
          <div>
            <h5>
              Replace or find its a straight forward functionality, here we want to display that we can acheive it via
              the add in.
            </h5>
            <Accordion title="Replace">
              <ReplaceComponent/>
            </Accordion>
            <Accordion title="Find">
              <FindComponent/>
            </Accordion>
          </div>
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
        {/* <Accordion title="GenAI">
          <GenAi/>
        </Accordion> */}
        <Accordion title="Gamma">
          <Gamma/>
        </Accordion>
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
