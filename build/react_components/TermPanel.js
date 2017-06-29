/** @jsx React.DOM */
var React = require("react");

var VariableSpan = React.createClass({displayName: 'VariableSpan',
  /*ENTER_LEAVE_TAG: "var-target",

  onMouseEnter: function() {
    var props = this.props;

    props.map.tag( props.index, this.ENTER_LEAVE_TAG );
  },

  onMouseLeave: function() {
    var props = this.props;

    props.map.tag( props.index, this.ENTER_LEAVE_TAG, true );
  },*/

  render: function() {
    var props = this.props,
        state = props.state,
        index = props.index,
        className;

    className = state === undefined ?
      "hidden" :
      state ? "" : "negate";
  
    return (React.DOM.span({className:  "React-TermPanel-Variable " + className}, 
      React.DOM.span({className: "React-TermPanel-Variable-Inner"}, "x", React.DOM.sub(null, index ))
    ));
  }
});

var ImplicantRow = React.createClass({displayName: 'ImplicantRow',
  ENTER_LEAVE_TAG: "implicant-target",

  onMouseEnter: function() {
    var props = this.props;

    props.map.tag( props.implicant.terms, this.ENTER_LEAVE_TAG );
  },

  onMouseLeave: function() {
    var props = this.props;

    props.map.tag( props.implicant.terms, this.ENTER_LEAVE_TAG, true );
  },

  render: function() {
    var props     = this.props,
        map       = props.map,
        implicant = props.implicant;

    return (React.DOM.div({className: "React-TermPanel-Implicant", 
                 onMouseEnter:  this.onMouseEnter, 
                 onMouseLeave:  this.onMouseLeave}, 
      implicant.states.map(function( state, index ) {
        return VariableSpan({map: map, state: state, index: index })
      })
    ));
  }
});

var TermPanel = React.createClass({displayName: 'TermPanel',
  render: function() {
    var props = this.props,
        map = props.map,
        func = map.state.func,
        implicants = props.min ? func.minImplicants : func.maxImplicants,
        rows;
    
    // get the divs
    rows = implicants.map(function( implicant ) {
      return ImplicantRow({map: map, implicant: implicant })
    });

    return (React.DOM.div({className: "React-TermPanel"}, 
      React.DOM.h2(null, "List of ",  this.props.min ? "minterm" : "maxterm", " implicants"), 
      rows 
    ));
  }
});

module.exports = TermPanel;