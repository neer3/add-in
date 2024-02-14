import React, { Component } from "react";

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
  }

  initWebSocket = () => {
    let websocketUrl = "";
    return (new WebSocket(websocketUrl));
  };
  
  componentWillUnmount() {
    // if (this.pingCheckTimer) {
    //   clearInterval(this.pingCheckTimer);
    // }
    this.ws.close();
  };


  componentDidMount() {
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            guid: "fgox2wff1707804736774",
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
        this.setState((prevState) => ({
          messages: [...prevState.messages, event.data],
        }));
      }
    };
  }

  sendMessage = async () => {
    var docSelection = '';
    await Word.run(async (context) => {
      var selection = context.document.getSelection();
      context.load(selection, 'text');

      await context.sync();

      // setSelectionData(selection.text);
      debugger;
      console.log(selection);

      if(selection.text.length === 0){
        // selection =

        //need to put the logic to get the whole doc in csv or any other format

        return;
      }
      docSelection = selection.text;
    });

    var payload = {
      feature: "addin",
      question_content: this.state.input,
      prompt_api_label: "AdhocPrompt",
      app_api_label: "AdhocPrompt",
      mapping_id: 0,
      context: "ALL",
      conversation_id: "fgox2wff1707804736774",
      scrollToBottom: true,
      route: "interaction",
      chat_request_id: "fgox2wff1707804736780",
    };
    payload["reportsData"] = docSelection;

    if (payload["reportsData"].length <= 5) {
      return;
    }
    var baseUrl = "https://alpha.lvh.me:5701/api/v1/reports_chat/fgox2wff1707804736774/interaction"
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer `,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      debugger;
      // setResponseData(data.text);
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
    this.setState({ input: "" });
  };

  fetchDataFromDoc = async () => {
    await Word.run(async (context) => {
      var selection = context.document.getSelection();
      context.load(selection, 'text');

      await context.sync();

      // setSelectionData(selection.text);

      // console.log(selectionData);

      if(selectionData.length === 0){
        // selection =

        //need to put the logic to get the whole doc in csv or any other format

        return;
      }

      return selection;
    });
  };

  render() {
    return (
      <div>
        <div>
          {this.state.messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <input type="text" value={this.state.input} onChange={(e) => this.setState({ input: e.target.value })} />
        <button onClick={this.sendMessage}>Send</button>
      </div>
    );
  }
}

export default Chat;
