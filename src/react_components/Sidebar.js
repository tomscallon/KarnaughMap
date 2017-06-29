/** @jsx React.DOM */
var React     = require("react"),
    TermPanel = require("components:TermPanel");

var Sidebar = React.createClass({
  getInitialState: function() {
    var kids = this.props.children, // hide yo' wife
        elements;

    

    return {
      active: 0
    };
  },

  render: function() {
    return (<div className="React-Sidebar">
      <TermPanel map={ this.props.map } min={ false } />
    </div>);
  }
});

module.exports = Sidebar;