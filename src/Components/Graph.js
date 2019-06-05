import React, { Component } from "react";
import bb from "billboard.js";
import "billboard.js/dist/billboard.css";
import "billboard.js/dist/theme/insight.css";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "EURUSD" };
    this.chart = null;
    this.getCurrencyPairLabel = this.getCurrencyPairLabel.bind(this);
  }
  handleChange(event) {
    this.props.handleChange(event.target.value);
    this.chart.unload({
      ids: this.state.value
    });
    this.setState({ value: event.target.value });
  }

  componentDidMount() {
    this.chart = bb.generate({
      data: {
        columns: [[this.state.value, ...this.props.graphData]]
      },
      bindto: "#" + this.props.id
    });
  }

  componentDidUpdate() {
    this.chart.load({
      columns: [[this.state.value, ...this.props.graphData]]
    });
  }

  getCurrencyPairLabel(currenyPair) {
    var str1 = currenyPair.slice(0, 3);
    var str2 = currenyPair.slice(3);
    return str1 + "/" + str2;
  }

  render() {
    let options = this.props.currencyPairs.map((currenyPair, index) => {
      return (
        <option key={index} value={currenyPair.currency_name}>
          {this.getCurrencyPairLabel(currenyPair.currency_name)}
        </option>
      );
    });
    return (
      <div className="graph">
        <select
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        >
          {options}
        </select>
        <h1>{this.props.graphData[this.props.graphData.length - 1]}</h1>
        <div id={this.props.id} />
      </div>
    );
  }
}

export default Graph;
