export class PramataSetting {
  static authToken() {
    let jwtToken = null;
    let moduleUrl = "";
    let cookies = document.cookie.split(';').map(cookie => cookie.trim());
    let session_id = cookies.find(cookie => cookie.startsWith('voyager_container_session_id='));
    debugger;
    fetch(`https://gamma-dev.pramata.com/gen-ai-api/auth/token?allow_unpublished=false`, {
      method: "GET",
      credentials: "include",
    })
      .then((resp) => {
        debugger;
        if (resp.status === 200) {
          return resp.json();
        }
        throw resp;
      })
      .then((resp) => {
        // this.setState({
        //   requests: [],
        //   streamingData: false,
        // });
        jwtToken = resp["token"];
      })
      .catch();

    return jwtToken;
  }
}
