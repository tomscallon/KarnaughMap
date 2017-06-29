/** @jsx React.DOM */
var React     = require("react"),
    TermPanel = require("components:TermPanel");

var Sidebar = React.createClass({displayName: 'Sidebar',
  getInitialState: function() {
    var kids = this.props.children, // hide yo' wife
        elements;

    

    return {
      active: 0
    };
  },

  render: function() {
    return (React.DOM.div({className: "React-Sidebar"}, 
      TermPanel({map:  this.props.map, min: false })
    ));
  }
});

module.exports = Sidebar;