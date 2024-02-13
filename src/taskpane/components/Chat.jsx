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
  }

  initWebSocket = () => {
    let websocketUrl = "";
    return (new WebSocket(websocketUrl));
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
      this.setState((prevState) => ({
        messages: [...prevState.messages, event.data],
      }));
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  sendMessage = () => {
    this.ws.send(this.state.input);
    this.setState({ input: "" });
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
