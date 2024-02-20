import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import "./Bot.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

class Chat extends Component {
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
    this.index=0;
  }

  initWebSocket = () => {
    let websocketUrl = `wss://alpha.lvh.me:5700/api/v1/chat/${this.guid}/ws?token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InRlbmFudCI6ImFscGhhIiwidXNlcm5hbWUiOiJsNXVscG04ZmMzMDYiLCJlbWFpbCI6Im5lZXJhai5zaW5naEBwcmFtYXRhLmNvbSIsInNob3dfdW5wdWJsaXNoZWRfZGF0YSI6dHJ1ZX0sImV4cCI6MTcyNTEwMDg1MH0.VAAKIKcZJzkurqCqfiMnItEkn1RXSeAdSNhDu5RBFxc`;
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
            debugger;
            var parsedValue = JSON.parse(match[1].trim());
            Object.keys(parsedValue).map((key) => {
              jsonObject[key] = {
                "Proposed Change": parsedValue[key]["Proposed Change"],
                "Negotiation Recommendation": parsedValue[key]["Negotiation Recommendation"],
                paragraph_index: parsedValue[key]["paragraph_index"],
              };
            });
          }

          var messagesCompCopy = [];
          Object.keys(jsonObject).map((key) => {
            const value = jsonObject[key];
            messagesCompCopy.push(
              <div key={key} onClick={() => this.scrollToParagraph(value.paragraph_index)} style={{ cursor: "pointer" }}>
                <h3>{key}</h3>
                <p>Proposed Change: {value["Proposed Change"]}</p>
                <p>Negotiation Recommendation: {value["Negotiation Recommendation"]}</p>
                <p>Paragraph Index: {value["paragraph_index"]}</p>
              </div>
            );
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

  resetHighlight = async() => {
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items, count");
  
      await context.sync();
      paragraphs.items[this.index].font.highlightColor = "white";
  
      await context.sync();
    });
  }

  scrollToParagraph = async (inputValue) => {
    this.resetHighlight()
    
    var regex = /\d+/;
    inputValue = parseInt(inputValue.match(regex)[0]);
    this.index=inputValue;
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items, count");
  
      await context.sync();
      if (inputValue < 0 || inputValue >= paragraphs.count) {
        console.error("Invalid paragraph index.");
        return;
      }
  
      const targetParagraph = paragraphs.items[inputValue];
      paragraphs.items[inputValue].font.highlightColor = "yellow";
      targetParagraph.getRange().select();
      targetParagraph.getRange().scrollIntoView();
  
      await context.sync();
    });
  }

  OriginaldocumentToCsv = async () => {
    // if(calledLLM === true){
    //   return;
    // }

    // setCalledLLM(true);
    let csvRows = [];
     // csvRows.push('"[paragraph index]","[legal text]"');
     await Word.run(async (context) => {
      const body = context.document.body;
      const paragraphs = body.paragraphs;
      paragraphs.load("text");
      await context.sync();
      for (let i = 0; i < paragraphs.items.length && i < 50; i++) {
        let paragraph = paragraphs.items[i];
        let text = paragraph.text;
        text = text.replace(/[^a-zA-Z0-9\s]/g, "");
        if (text.length > 2) {
          let csvRow = "paragraph_index_" + i + "::" + text;
          csvRows.push(csvRow);
        }
      }
    });
    return csvRows.join("\n");
  };

  startInteract = async (payload) => {
    if (payload.prompt_api_label === "AddInSuggestions") {
      var current_content = "";
      var original_content = "";
      await Word.run(async (context) => {
        const body = context.document.body;

        body.load("text");

        await context.sync();

        var v = body.getReviewedText(Word.ChangeTrackingVersion.original);

        await context.sync();

        let csvRows = [];
        // csvRows.push('"[paragraph index]","[legal text]"');
        await Word.run(async (context) => {
          const body = context.document.body;
          const paragraphs = body.paragraphs;
          paragraphs.load("text");
          await context.sync();
          for (let i = 0; i < paragraphs.items.length && i < 50; i++) {
            let paragraph = paragraphs.items[i];
            let text = paragraph.text;
            text = text.replace(/[^a-zA-Z0-9\s]/g, "");
            if (text.length > 2) {
              let csvRow = "paragraph_index_" + i + "::" + text;
              csvRows.push(csvRow);
            }
          }
        });

        current_content = csvRows.join("\n");
        original_content = v.value.substring(0, 1500);
      });
      payload["reportsData"] = {
        latest_contract: current_content,
        previous_contract: original_content,
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

    var baseUrl = `https://alpha.lvh.me:5700/api/v1/reports_chat/${this.guid}/interaction`;
    try {
      fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InRlbmFudCI6ImFscGhhIiwidXNlcm5hbWUiOiJsNXVscG04ZmMzMDYiLCJlbWFpbCI6Im5lZXJhai5zaW5naEBwcmFtYXRhLmNvbSIsInNob3dfdW5wdWJsaXNoZWRfZGF0YSI6dHJ1ZX0sImV4cCI6MTcyNTEwMDg1MH0.VAAKIKcZJzkurqCqfiMnItEkn1RXSeAdSNhDu5RBFxc`,
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
      debugger;
    }

    // fetchRequest(`/api/v1/reports_chat/${this.guid}/${payload.route}`, "POST", payload, false)
    //   .then((resp) => {
    //     if (resp.status === 201) {
    //       return resp.json();
    //     } else if (resp.status === 204) {
    //       return null;
    //     }
    //     throw resp;
    //   }).then((resp) => {
    //     if (typeof resp === "object") {
    //       this.requests = [...(resp?.requests || []), ...this.requests];
    //     }
    //     this.chatInProgress = false;
    //     this.setState({ streamingData: this.requests.length > 0 });
    //   }).catch(this.setSometingWrong);

    // this.ws.send(this.state.input);
    // this.setState({ input: "" });
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

    if (!streamingData && input.trim() !== "") {
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

      if (input === "AddInPrompt") {
        queryParams = {
          feature: "addin",
          question_content: "",
          prompt_api_label: "AddInSuggestions",
          app_api_label: "AddInPrompt",
          mapping_id: 11,
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
        // const match = this.textParser(inputString);
        // if (match) {
        //   toChange = true;
        //   let newLines = [];
        //   const lines = [...match];
        //   lines.forEach((line, index) => {
        //     if (index !== 1) {
        //       newLines.push(line.split("|").slice(1,-1).map((data) => {return data.trim()}));
        //     }
        //   })
        //   messageObject.button = {
        //     "label": ANALYZE_DATA,
        //     "data": newLines
        //   }
        // }
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
    // if (!streamingData) {
    //   this.preProcessChatMessages(messages);
    // }
    // <Markdown remarkPlugins={[remarkGfm]}>
    // {typeof chat.message == "undefined" ? JSON.parse(chat).message.body : chat.message}
    // </Markdown>

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
        <div className="header">GenAI Assist</div>
        <div className="body markdown-body" id="contract-chat">
          <div className="chat-list" id="chat-list">
            {this.renderConversation(messages)}
          </div>
        </div>

        <div className="new-chat">
          <div className="quick-actins">{this.renderPrompts(standardPrompts)}</div>
          <Form className="chat-form" autoComplete="off">
            <Form.Field className="editor-field">
              <textarea
                onChange={(e) => {
                  this.setState({ input: e.target.value });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    this.handleSendMessage();
                    return true;
                  }
                }}
                className="user-chat"
                name="chat"
                placeholder="Provide prompt"
                ref={this.inputRef}
                rows="1"
                type="text"
                value={input}
                disabled={streamingData || establishingSocketconnection}
              />
              <div className="chat-action-icons">
                {streamingData || establishingSocketconnection ? (
                  <span className="loading-dots">
                    <span className="dot one">{"."}</span>
                    <span className="dot two">{"."}</span>
                    <span className="dot three">{"."}</span>
                  </span>
                ) : (
                  <i className="large link icon icon-send" onClick={this.handleSendMessage} />
                )}
              </div>
            </Form.Field>
          </Form>
        </div>

        {/* <div>
          {this.state.messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <input type="text" value={this.state.input} onChange={(e) => this.setState({ input: e.target.value })} />
        <button onClick={this.sendMessage}>Send</button> */}
      </div>
    );
  }
}

export default Chat;
