import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import Comment from "./Comment";
import Accordion from "./Accordion";
import { Button, makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import TextExport from "./TextExport";
import ApprovalComponent from "./ApprovalComponent";
import Insert from "./Insert";
import ReplaceComponent from "./ReplaceComponent";
import FindComponent from "./FindComponent";

const useStyles = makeStyles({
  root: {
    maxHeight: "100vh",
  },
});

const App = (props) => {
  const styles = useStyles();
  // The list items are static and won't change at runtime,
  // so this should be an ordinary const, not a part of state.
  return (
    <div className={styles.root}>
      <Header
        logo="https://www.pramata.com/wp-content/uploads/2022/12/cropped-Copy-of-pramata-logo-2000px-1.png"
        title={props.title}
        message=""
      />
      <div>
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
            <h5>Inserting any text/paragraph in 3 different modes start, end and in middle.</h5>
            <Insert/>
          </div>
        </Accordion>
        <Accordion title="Comment">
          <div>
            <h5>Comment can be added to a string/text or a paragraph</h5>
          </div>
          <div>
            <Comment/>
          </div>
        </Accordion>
        <Accordion title="Accept/Reject">
          <div>
            <h5>Confirming the red lined changes</h5>
          </div>
          <div>
            <ApprovalComponent/>
          </div>
        </Accordion>
        <Accordion title="Original/Current">
          <TextExport/>
        </Accordion>
      </div>
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
