import React, { Component } from "react";
import Graph from "./Graph";

class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyPairs: [],
      errorMessage: "",
      loading: false,
      totalItemsCount: 0,
      graphData1: [],
      graphData2: [],
      graphData3: [],
      pipValue: 1
    };
    this.socket1 = null;
    this.socket2 = null;
    this.socket3 = null;
  }

  createSocket() {
    var websocket = new WebSocket("wss://stocksimulator.intuhire.com");
    return websocket;
  }

  graph1Change = currencyPair => {
    console.log("Curreny Pair sent ", currencyPair);
    this.setState({ graphData1: [] }, () => {
      this.socket1.send(JSON.stringify({ currencyPair: currencyPair }));
    });
  };

  graph2Change = currencyPair => {
    console.log("Curreny Pair sent ", currencyPair);
    this.setState({ graphData2: [] }, () => {
      this.socket2.send(JSON.stringify({ currencyPair: currencyPair }));
    });
  };

  graph3Change = currencyPair => {
    console.log("Curreny Pair sent ", currencyPair);
    this.setState({ graphData3: [] }, () => {
      this.socket3.send(JSON.stringify({ currencyPair: currencyPair }));
    });
  };

  componentDidMount() {
    //Creating socket1 for Graph 1
    this.socket1 = this.createSocket();

    this.socket1.onclose = evt => {
      console.log("Closing connection");
    };
    this.socket1.onmessage = evt => {
      console.log("Data Received in 1: ", evt.data);
      var array = [...this.state.graphData1, evt.data];
      if (array.length > 10) array.shift();
      this.setState({ graphData1: array });
    };
    this.socket1.onopen = evt => {
      console.log("Socket1 connection established.");
      this.socket1.send(JSON.stringify({ currencyPair: "EURUSD" }));
    };

    //Creating socket2 for Graph 2
    this.socket2 = this.createSocket(2);

    this.socket2.onclose = evt => {
      console.log("Closing connection");
    };
    this.socket2.onmessage = evt => {
      console.log("Data Received 2: ", evt.data);
      var array = [...this.state.graphData2, evt.data];
      if (array.length > 10) array.shift();
      this.setState({ graphData2: array });
    };
    this.socket2.onopen = evt => {
      console.log("Socket2 connection established.");
      this.socket2.send(JSON.stringify({ currencyPair: "EURUSD" }));
    };

    //Creating socket3 for Graph 3
    this.socket3 = this.createSocket(3);

    this.socket3.onclose = evt => {
      console.log("Closing connection");
    };
    this.socket3.onmessage = evt => {
      console.log("Data Received 3: ", evt.data);
      var array = [...this.state.graphData3, evt.data];
      if (array.length > 10) array.shift();
      this.setState({ graphData3: array });
    };
    this.socket3.onopen = evt => {
      console.log("Socket3 connection established.");
      this.socket3.send(JSON.stringify({ currencyPair: "EURUSD" }));
    };
  }

  handleChange(e) {
    this.setState({ pipValue: e.target.value });
  }

  increasePip = e => {
    this.setState({ pipValue: +this.state.pipValue + 1 });
  };

  decreasePip = e => {
    this.setState({
      pipValue:
        this.state.pipValue === 0
          ? 0
          : +this.state.pipValue - 1 < 0
          ? 0
          : +this.state.pipValue - 1
    });
  };

  render() {
    let graph1Value = this.state.graphData1[this.state.graphData1.length - 1];
    let graph2Value = this.state.graphData2[this.state.graphData2.length - 1];
    let graph3Value = this.state.graphData3[this.state.graphData3.length - 1];
    let computedValue = +graph1Value / +graph2Value - +graph3Value;
    if (computedValue < -(+this.state.pipValue / 1000)) {
      this.buttonClass = "buy-button";
      this.buttonLabel = "BUY";
    } else if (computedValue > +this.state.pipValue / 1000) {
      this.buttonClass = "sell-button";
      this.buttonLabel = "SELL";
    } else if (
      computedValue > -(+this.state.pipValue / 1000) &&
      computedValue < +this.state.pipValue / 1000
    ) {
      this.buttonClass = "disable-button";
      this.buttonLabel = "";
    }

    return (
      <div className="graph-container">
        <div className="pip-selector">
          <label htmlFor="pip">
            PIP Difference
            <i className="fas fa-minus" onClick={this.decreasePip} />
            <i className="fas fa-plus" onClick={this.increasePip} />
          </label>
          <input
            id="pip"
            type="text"
            value={this.state.pipValue}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className="graph1">
          <Graph
            currencyPairs={this.props.currencyPairs}
            handleChange={this.graph1Change}
            graphData={this.state.graphData1}
            id="lineChart1"
          />
        </div>
        <div className="graph2">
          <Graph
            currencyPairs={this.props.currencyPairs}
            handleChange={this.graph2Change}
            graphData={this.state.graphData2}
            id="lineChart2"
          />
        </div>
        <div className="graph3">
          <Graph
            currencyPairs={this.props.currencyPairs}
            handleChange={this.graph3Change}
            graphData={this.state.graphData3}
            id="lineChart3"
          />
        </div>
        <div className="button">
          <button className={this.buttonClass}>{this.buttonLabel}</button>
        </div>
      </div>
    );
  }
}

export default GraphContainer;
