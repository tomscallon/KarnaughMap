/** @jsx React.DOM */
var React = require("react");

var InputBar = React.createClass({displayName: 'InputBar',
  getDefaultProps: function() {
    return {
      placeholder: "Enter your text here",
      validate: function() {}
    };
  },

  getInitialState: function() {
    return { 
      text: "",
      error: ""
    };
  },

  handleInput: function( ev ) {
    var text = ev.target.value;

    ev.preventDefault();
    this.setState({
      text: text,
      error: this.props.validate.call( this.refs.input.getDOMNode(), text, this.state.text )
    });
  },

  focusInput: function() {
    this.refs.input.getDOMNode().focus();
  },

  render: function() {
    var error = this.state.error;

    return (
      React.DOM.div({className: "React-InputBar " + (error ? "invalid" : "") }, 
        React.DOM.input({ref: "input", 
               type: "text", 
               className: "React-InputBar-Input", 
               placeholder:  this.props.placeholder, 
               onChange:  this.handleInput}), 
        React.DOM.div({className: "React-InputBar-Error", 
             style:  error ? {} : { display: "none" }}, error )
      )
    );
  }
});

module.exports = InputBar;