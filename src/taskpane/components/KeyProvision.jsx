import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PramataSetting } from "./Token";

class KeyProvision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      input: "",
      adhocPromptDetails: {},
      conversationId: null,
      standardPrompts: [],
      streamingData: false,
      wsInactive: true,
      analyseData: null,
    };

    this.ws = this.initWebSocket();
    this.messages = [];
    this.requests = [];
    this.chatRequestId = null;
    this.lastPingReceivedTimestamp = Date.now();
    this.lastResponseReceivedTimestamp = Date.now();
    this.socketInitiateTime = Date.now();
    this.guid = `${Math.random().toString(36).substring(2, 10)}${new Date().getTime()}`;
    this.index = 0;
  }

  initWebSocket = () => {
    // let websocketUrl = `wss://alpha.lvh.me:5701/api/v1/chat/${this.guid}/ws?token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InRlbmFudCI6ImFscGhhIiwidXNlcm5hbWUiOiJsNXVscG04ZmMzMDYiLCJlbWFpbCI6Im5lZXJhai5zaW5naEBwcmFtYXRhLmNvbSIsInNob3dfdW5wdWJsaXNoZWRfZGF0YSI6dHJ1ZX0sImV4cCI6MTcyNTEwMDg1MH0.VAAKIKcZJzkurqCqfiMnItEkn1RXSeAdSNhDu5RBFxc`;
    let websocketUrl = `wss://gamma-dev.pramata.com/gen-ai-api/api/v1/chat/${this.guid}/ws?token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InRlbmFudCI6ImdhbW1hIiwidXNlcm5hbWUiOiJsNXVscG04ZmMzMDYiLCJlbWFpbCI6Im5lZXJhai5zaW5naEBwcmFtYXRhLmNvbSIsInNob3dfdW5wdWJsaXNoZWRfZGF0YSI6dHJ1ZX0sImV4cCI6MTcyNjMxMTA2NX0.OZM6Gk5xsNLjqMc8zE86tEZfUg2KLvyWuxjDDGxiTRw`;
    return new WebSocket(websocketUrl);
  };

  componentWillUnmount() {
    // if (this.pingCheckTimer) {
    //   clearInterval(this.pingCheckTimer);
    // }
    this.ws.close();
  }

  componentDidMount() {
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            guid: this.guid,
            channel: `GenaiChatChannel`,
          }),
        })
      );
    };

    this.ws.onerror = () => {
      this.setState({ wsInactive: true });
    };

    this.ws.onclose = () => {
      this.setState({ wsInactive: true });
    };

    this.ws.onmessage = (event) => {
      const respJson = JSON.parse(event.data);
      let { messages, requests, chatRequestId } = this;
      if (respJson.type === "ping" || respJson.type === "welcome") {
        this.lastPingReceivedTimestamp = Date.now();
      } else if (respJson.type === "disconnect" || respJson.type === "reject_subscription") {
        this.setState({ wsInactive: true });
      } else if (respJson.type === "confirm_subscription") {
        this.setState({ wsInactive: false });
      } else {
        var temp = JSON.parse(event.data);
        if (temp.message.body === "") {
          return;
        }
        if (temp.message.type === "stop") {
          var regex = /```json([\s\S]*?)```/g;
          var match;
          var jsonObject = {};
          while ((match = regex.exec(temp.message.body)) !== null) {
            //;
            var parsedValue = JSON.parse(match[1].trim());
            Object.keys(parsedValue).map((key) => {
              jsonObject[key] = {
                summary: parsedValue[key]["short_summary"],
                paragraph_index: parsedValue[key]["paragraph_index"],
              };
            });
          }

          //;
          // here you need to add the comments
          Object.keys(jsonObject).map((key) => {
            if (jsonObject[key].paragraph_index.length > 0) {
              this.addCommentsPara(key, jsonObject[key].paragraph_index);
            }
          });
          //;
          var messagesCompCopy = [];
          Object.keys(jsonObject).map((key) => {
            const value = jsonObject[key];
            if (value.paragraph_index.length > 0) {
              messagesCompCopy.push(
                <div
                  key={key}
                  onClick={() => this.scrollToParagraph(value.paragraph_index)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>{key}</h3>
                  <p>Summary: {value["summary"]}</p>
                </div>
              );
            }
          });

          var messagesCopy2 = this.state.messages;
          messagesCopy2[messagesCopy2.length - 1] = messagesCompCopy;
          this.setState((prevState) => ({
            messages: messagesCopy2,
          }));
        } else {
          var messagesCopy = this.state.messages;

          messagesCopy[messagesCopy.length - 1] = event.data;
          this.setState((prevState) => ({
            messages: messagesCopy,
          }));
        }
      }
    };
  }

  addCommentsPara = async (commentValue, inputValue) => {
    var regex = /\d+/;
    var start_para = parseInt(inputValue[0].toString().match(regex)[0]);
    var end_para = parseInt(inputValue[inputValue.length - 1].toString().match(regex)[0]);

    await Word.run(async (context) => {
      const body = context.document.body;
      var paragraphs = body.paragraphs;
      paragraphs.load("items");

      // wait to load the data in the var;
      await context.sync();

      var b = paragraphs.items[start_para].getRange();
      for (var i = start_para + 1; i <= end_para; i++) {
        b = b.expandTo(paragraphs.items[i].getRange());
      }
      //;
      b.insertComment(commentValue);
    });
  };

  resetHighlight = async () => {
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items, count");

      await context.sync();
      paragraphs.items[this.index].font.highlightColor = "white";

      await context.sync();
    });
  };

  scrollToParagraph = async (inputValue) => {
    this.resetHighlight();

    var regex = /\d+/;
    var start_para = parseInt(inputValue[0].toString().match(regex)[0]);
    var end_para = parseInt(inputValue[inputValue.length - 1].toString().match(regex)[0]);
    this.index = start_para;
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items, count");

      await context.sync();
      if (start_para < 0 || start_para >= paragraphs.count) {
        console.error("Invalid paragraph index.");
        return;
      }

      var targetParagraph = paragraphs.items[start_para];

      //;

      paragraphs.items[start_para].font.highlightColor = "yellow";
      targetParagraph.getRange().select();
      targetParagraph.getRange().scrollIntoView();

      await context.sync();
    });
  };

  startInteract = async (payload) => {
    if (payload.prompt_api_label === "AddInSuggestions" || true) {
      let csvRows = {};
      // csvRows.push('"[paragraph index]","[legal text]"');
      await Word.run(async (context) => {
        const body = context.document.body;
        const paragraphs = body.paragraphs;
        paragraphs.load("text");
        await context.sync();
        for (let i = 0; i < paragraphs.items.length && i < 20; i++) {
          let paragraph = paragraphs.items[i];
          let text = paragraph.text;
          text = text.replace(/[^a-zA-Z0-9\s]/g, "");
          if (text.length > 2) {
            // let csvRow = "paragraph_index_" + i + "::" + text;
            // csvRows.push(csvRow);
            csvRows[`paragraph_index_${i}`] = text;
          }
        }
      });

      payload["reportsData"] = {
        latest_contract: csvRows,
      };
    } else {
      let csvRows = [];
      csvRows.push('"[paragraph index]","[legal text]"');
      await Word.run(async (context) => {
        const body = context.document.body;
        const paragraphs = body.paragraphs;
        paragraphs.load("text");
        await context.sync();
        for (let i = 0; i < paragraphs.items.length && i < 40; i++) {
          let paragraph = paragraphs.items[i];
          let text = paragraph.text;
          text = text.replace(/[^a-zA-Z0-9\s]/g, "");
          if (text.length > 2) {
            let csvRow = i + ',"' + text + '"';
            csvRows.push(csvRow);
          }
        }
      });

      payload["reportsData"] = csvRows.join("\n");

      if (payload["reportsData"].length <= 5) {
        return;
      }
    }

    var baseUrl = `https://gamma-dev.pramata.com/gen-ai-api/api/v1/reports_chat/${this.guid}/interaction`;
    try {
      fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InRlbmFudCI6ImdhbW1hIiwidXNlcm5hbWUiOiJsNXVscG04ZmMzMDYiLCJlbWFpbCI6Im5lZXJhai5zaW5naEBwcmFtYXRhLmNvbSIsInNob3dfdW5wdWJsaXNoZWRfZGF0YSI6dHJ1ZX0sImV4cCI6MTcyNjMxMTA2NX0.OZM6Gk5xsNLjqMc8zE86tEZfUg2KLvyWuxjDDGxiTRw`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((resp) => {
          if (resp.status === 201) {
            return resp.json();
          } else if (resp.status === 204) {
            return null;
          }
          throw resp;
        })
        .then((resp) => {
          this.setState({
            requests: [],
            streamingData: false,
          });
        })
        .catch(this.setSometingWrong);
    } catch (error) {
      // //;
    }
  };

  fetchDataFromDoc = async () => {
    await Word.run(async (context) => {
      var selection = context.document.getSelection();
      context.load(selection, "text");

      await context.sync();

      // setSelectionData(selection.text);

      // console.log(selectionData);

      if (selectionData.length === 0) {
        // selection =

        //need to put the logic to get the whole doc in csv or any other format

        return;
      }

      return selection;
    });
  };

  scrollToBottom = () => {
    let scrollDiv = document.querySelector(".chatbot-container");
    scrollDiv.scrollTop = scrollDiv.scrollHeight;
  };

  newConversationId = () => {
    return `${this.guid}${new Date().getTime()}`;
  };

  handleSendMessage = () => {
    const { input, streamingData, messages } = this.state;
    const { reportsData, exportPayload } = this.props;
    let { conversationId } = this.state;

    if (!streamingData) {
      // conversationId = conversationId || this.newConversationId();
      conversationId = this.guid;

      let queryParams = {
        feature: "addin",
        question_content: this.state.input,
        prompt_api_label: "AdhocPrompt",
        app_api_label: "AdhocPrompt",
        mapping_id: 0,
        context: "ALL",
        conversation_id: this.guid,
        scrollToBottom: true,
        route: "interaction",
        chat_request_id: this.newConversationId,
      };

      // eslint-disable-next-line no-constant-condition
      if (input === "AddInPrompt" || true) {
        queryParams = {
          feature: "addin",
          question_content: "",
          prompt_api_label: "AddInKeyProvisions",
          app_api_label: "AddInKeyProvisions",
          mapping_id: 12, //here
          context: "ALL",
          conversation_id: this.guid,
          scrollToBottom: true,
          route: "interaction",
          chat_request_id: this.newConversationId,
        };
      }

      this.setState({
        messages: [
          // ...conversationId === this.state.conversationId ? messages : [],
          ...(conversationId === this.guid ? messages : []),
          {
            message: input,
            user: true,
            type: "question",
            messsageChunks: [{ text: input, index: 0 }],
          },
          {
            message: "Processing ...",
            user: false,
            type: "in-progress",
            messsageChunks: [{ text: "Processing ...", index: 0 }],
          },
        ],
        streamingData: true,
        input: "",
        conversationId,
      });
      setTimeout(this.scrollToBottom, 100);
      setTimeout(this.startInteract, 3000, queryParams);
    }
  };

  handleSendMessage2 = () => {
    // try {
    //   var t = PramataSetting.authToken();
    // } catch (e) {
    //   debugger;
    // }
    // debugger;
    const { input, streamingData, messages } = this.state;
    const { reportsData, exportPayload } = this.props;
    let { conversationId } = this.state;

    if (!streamingData) {
      // conversationId = conversationId || this.newConversationId();
      conversationId = this.guid;

      let queryParams = {
        feature: "addin",
        question_content: this.state.input,
        prompt_api_label: "SummarizeKeyProvisions",
        app_api_label: "SummarizeKeyProvisions",
        mapping_id: 0,
        context: "ALL",
        conversation_id: this.guid,
        scrollToBottom: true,
        route: "interaction",
        chat_request_id: this.newConversationId,
      };

      // eslint-disable-next-line no-constant-condition
      if (input === "AddInPrompt" || true) {
        queryParams = {
          feature: "addin",
          question_content: "",
          prompt_api_label: "SummarizeKeyProvisions",
          app_api_label: "SummarizeKeyProvisions",
          mapping_id: 13, //here
          context: "ALL",
          conversation_id: this.guid,
          scrollToBottom: true,
          route: "interaction",
          chat_request_id: this.newConversationId,
        };
      }

      this.setState({
        messages: [
          // ...conversationId === this.state.conversationId ? messages : [],
          ...(conversationId === this.guid ? messages : []),
          {
            message: input,
            user: true,
            type: "question",
            messsageChunks: [{ text: input, index: 0 }],
          },
          {
            message: "Processing ...",
            user: false,
            type: "in-progress",
            messsageChunks: [{ text: "Processing ...", index: 0 }],
          },
        ],
        streamingData: true,
        input: "",
        conversationId,
      });
      setTimeout(this.scrollToBottom, 100);
      setTimeout(this.startInteract, 3000, queryParams);
    }
  };

  textParser = (text) => {
    let tableLines = null;
    text.split("\n").forEach((line) => {
      line = line.trim();
      if (!line) return "";
      if (line.startsWith("|") && line.endsWith("|")) {
        if (tableLines === null) {
          tableLines = [];
        }
        tableLines.push(line);
      }
    });

    return tableLines;
  };

  preProcessChatMessages = (messages) => {
    let processedMessages = [];
    let toChange = false;

    messages.forEach((messageObject) => {
      if (!messageObject.button) {
        const inputString = messageObject.message;
        if (!inputString) {
          messageObject;
        }
      }
      processedMessages.push({ ...messageObject });
    });
    if (toChange) {
      this.setState({ messages: processedMessages });
    }
  };

  parseToHTML = (htmlString) => {
    var parser = new DOMParser();
    // Parse the HTML string
    var parsedHtml = parser.parseFromString(htmlString, "text/html");

    return { __html: parsedHtml.body.innerHTML };
  };

  renderChatPara = (chat) => {
    return chat.map((component, index) => <div key={index}>{component}</div>);
  };

  renderConversation = (messages) => {
    let chatItems = [];
    const { streamingData } = this.state;

    messages.forEach((chat, i) => {
      if (Array.isArray(chat)) {
        chatItems.push(
          <div key={i} className="chat">
            <i className={chat.user ? "icon-user" : "icon-bot"} />
            <div className={chat.user ? "content user" : "content assistant"}>
              {this.renderChatPara(chat)}
              {chat.button ? this.renderChatButton(chat) : <></>}
            </div>
          </div>
        );
      } else {
        chatItems.push(
          <div key={i} className="chat">
            <i className={chat.user ? "icon-user" : "icon-bot"} />
            <div className={chat.user ? "content user" : "content assistant"}>
              <Markdown remarkPlugins={[remarkGfm]}>
                {typeof chat.message == "undefined" ? JSON.parse(chat).message.body : chat.message}
              </Markdown>
              {chat.button ? this.renderChatButton(chat) : <></>}
            </div>
          </div>
        );
      }
    });
    return chatItems;
  };

  handleStandardPromptClick = (prompt) => {
    const { reportsData, exportPayload } = this.props;

    const conversationId = generatedId(this.guid);
    let queryParams = {
      reportsData: this.convertReportsData(reportsData),
      exportPayload,
      reportsToken: PramataSetting.authToken("reports-api"),
      feature: "reports",
      question_content: prompt.display_name,
      question_type: "prompt",
      conversation_id: conversationId,
      prompt_api_label: prompt.api_label,
    };
    this.setState({
      messages: [
        {
          message: prompt.display_name,
          user: true,
          type: "question",
          messsageChunks: [{ text: prompt.display_name, index: 0 }],
        },
        {
          message: "Processing ...",
          user: false,
          type: "in-progress",
          messsageChunks: [{ text: "Processing ...", index: 0 }],
        },
      ],
      streamingData: true,
      input: "",
      conversationId,
    });
    setTimeout(this.scrollToBottom, 100);
    setTimeout(this.startInteract, 3000, queryParams);
  };

  renderPrompts = (stdPrompts) => {
    let prompts = [];

    stdPrompts.forEach((prompt) => {
      prompts.push(
        <button
          key={prompt.id}
          className="ui button quick-actins-button"
          onClick={() => this.handleStandardPromptClick(prompt)}
          disabled={this.state.streamingData || this.state.wsInactive}
        >
          {prompt.display_name}
        </button>
      );
    });
    return prompts;
  };

  render() {
    const { messages, input, streamingData, establishingSocketconnection, standardPrompts, analyseData } = this.state;

    return (
      <div className="chatbot-container">
        <div className="body markdown-body" id="contract-chat">
          <div className="chat-list" id="chat-list">
            {this.renderConversation(messages)}
          </div>
        </div>

        <div className="new-chat">
          <div className="quick-actins">{this.renderPrompts(standardPrompts)}</div>
          <Button onClick={this.handleSendMessage}>All Key Provisions</Button>
          <br />
          <Button onClick={this.handleSendMessage2}>Limited Key Provisions</Button>
        </div>
      </div>
    );
  }
}

export default KeyProvision;
