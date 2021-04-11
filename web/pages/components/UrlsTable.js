import React from "react";

export default class UrlsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlsFromLocalStorage: [],
      loading: true,
    };
  }

  async componentDidMount() {
    this.state.urlsFromLocalStorage = await localStorage.getItem(
      "shortenedUrls"
    );
    this.setState({ loading: false });
    console.log(this.state.urlsFromLocalStorage);
  }

  clearUrls = async () => {
    await localStorage.removeItem("shortenedUrls");
    this.setState = { urlsFromLocalStorage: [] };
    window.location.reload();
  };

  render() {
    if (
      this.state.loading === false &&
      this.state.urlsFromLocalStorage !== null
    ) {
      return (
        <table>
          <button onClick={this.clearUrls}>CLEAR URLS</button>
          <tr>
            <th>URL</th>
          </tr>
          {JSON.parse(this.state.urlsFromLocalStorage).map((item) => (
            <tr>
              <td>{item.url}</td>
            </tr>
          ))}
        </table>
      );
    } else if (this.state.urlsFromLocalStorage === null) {
      return "";
    } else {
      return "Loading Urls...";
    }
  }
}
