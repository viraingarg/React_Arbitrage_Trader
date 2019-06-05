import React, { Component } from "react";
import axios from "axios";
import GraphContainer from "./Components/GraphContainer";
import "./css/style.css";
import Loader from "react-loader-spinner";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencyPairs: [],
      errorMessage: "",
      loading: false,
      totalItemsCount: 0
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("https://restsimulator.intuhire.com/currency_pairs")
      .then(response => {
        console.log("Success response from Api ", response);
        this.setState({
          currencyPairs: response.data,
          errorMessage: "",
          loading: false,
          totalItemsCount: response.data.length
        });
      })
      .catch(error => {
        console.log("Error response from Api", error.response);
        this.setState({
          currencyPairs: [],
          errorMessage: "Unable to fetch data, please try later.",
          loading: false,
          totalItemsCount: 0
        });
      });
  }

  render() {
    return (
      <div>
        <div id="header">
          <span>React Arbitrage Trader</span>
        </div>
        <div id="body">
          {this.state.loading ? (
            <div>
              <div className="loader loader-align">
                <Loader type="Watch" color="#00BFFF" height="100" width="100" />
              </div>
              <div className="loader-label loader">
                <span>Loading.....</span>
              </div>
            </div>
          ) : this.state.errorMessage !== "" ? (
            <span>Eroor Loading api</span>
          ) : (
            <GraphContainer currencyPairs={this.state.currencyPairs} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
