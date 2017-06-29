/** @jsx React.DOM */
var React          = require("react"),
    BooleanAlgebra = require("BooleanAlgebra");

var forEach = Array.prototype.forEach;

var STATE_COUNT = 3;
var STATE_DISPLAY = [ '0', '1', 'D' ];
var STATE_VALUE = [ false, true, undefined ];

var DEFAULT_VARS = 2;

var KarnaughCell = React.createClass({
  toggleState: function() {
    this.props.update( 
      this.props.index,
      ( this.props.state + 1 ) % STATE_COUNT
    );
  },

  onKeyDown: function( ev ) {
    switch( ev.keyCode || ev.which ) {
      
    }
  },

  onKeyUp: function( ev ) {
    switch( ev.keyCode || ev.which ) {
      case 13: // enter
        this.toggleState();
        break;
    }
  },

  render: function() {
    var props = this.props;

    return (
      <div ref="div"
           className="React-KarnaughCell" 
           onClick={ this.toggleState } 
           onKeyDown={ this.onKeyDown }
           onKeyUp={ this.onKeyUp }
           tabIndex={ props.index + 1 }>
        <div className="React-KarnaughCell-Inner">{ STATE_DISPLAY[ props.state ] }</div>
      </div>
    );
  }
});

var KarnaughMap = React.createClass({
  getDefaultProps: function() {
    return {
      initialNumVars: DEFAULT_VARS,
      onChange: function() {}
    };
  },

  getInitialState: function() {
    var initNumVars = this.props.initialNumVars,
        initTable = [ 0 ];

    for( var varCount = 0; varCount < initNumVars; varCount++ ) {
      initTable = initTable.concat( initTable );
    }

    return {
      numVars: initNumVars,
      table:   initTable,
      func:    new BooleanAlgebra.BooleanFunction( initNumVars, initTable )
    };
  },

  updateVar: function( index, value ) {
    var stateTable = this.state.table,
        valueTable,
        oldValue = stateTable[ index ];

    // update the changed var
    stateTable[ index ] = value;

    // redetermine the boolean function
    valueTable = stateTable.slice( 0, Math.pow( 2, this.state.numVars ) ).map(function( val ) { return STATE_VALUE[ val ]; });
    this.state.func = new BooleanAlgebra.BooleanFunction( this.state.numVars, valueTable );
    
    // force an update, call the on change handler
    this.forceUpdate();
    this.props.onChange( 
      index, 
      STATE_VALUE[ oldValue ], 
      STATE_VALUE[ value ], 
      this.state.func
    );
  },

  resize: function( newSize ) {
    var stateTable = this.state.table,
        valueTable,
        needed = Math.pow( 2, newSize );

    if( newSize === this.state.numVars ) return;

    // otherwise, ensure there's enough space
    while( stateTable.length < needed ) {
      stateTable.push( 0 );
    }
    this.state.numVars = newSize;
    
    // update the state function
    valueTable = stateTable.slice( 0, needed ).map(function( val ) { return STATE_VALUE[ val ]; });
    this.state.func = new BooleanAlgebra.BooleanFunction( this.state.numVars, valueTable );

    // force a re-render
    this.forceUpdate();
    this.props.onChange( 
      undefined, // no value was changed 
      undefined, // just a size change,
      undefined, // so leave these undefined
      this.state.func
    );
  },
  
  /**
   * Adds (or removes) CSS classes to the HTML elements corresponding to the requested cells.
   * 
   * @param {Array}     An array of integer representing which cells to tag
   * @param {Array}     An array of CSS class names to add (or remove)
   *        {String}    A string containing space-separated class names to add
   *        {undefined} A special value indicating ALL classes should be removed from the given cells
   * @param {Boolean}   true if the given classes should be REMOVED from the given cells,
   *                    false otherwise
   */
  tag: function( cells, classes, remove ) {
    var refs = this.refs,
        method = remove ? "remove" : "add";
    
    // if classes is a string, split it at spaces
    if( typeof classes === "string" || classes instanceof String ) {
      classes = classes.split(/\s+/);
    }

    if( classes === undefined ) {
      // indicates all classes should be remove
      cells.forEach(function( index ) {
        // remove each class
        refs[ index ].getDOMNode().className = "";
      });
    } else {
      // for each cell..
      cells.forEach(function( index ) {
        var classList = refs[ index ].getDOMNode().classList;

        // for each class...
        classes.forEach(function( className ) {
          // add or remove the class from the cell!
          classList[ method ]( className );
        });
      });
    }
  },

  onKeyDown: function( ev ) {
    switch( ev.keyCode || ev.which ) {
      case 13: // enter
        this.refs.wrapper.getDOMNode().classList.add("enter-pressed");
        break;
    }
  },

  onKeyUp: function( ev ) {
    switch( ev.keyCode || ev.which ) {
      case 13: // enter
        this.refs.wrapper.getDOMNode().classList.remove("enter-pressed");
        break;
    }
  },

  render: function() {
    var updateVar = this.updateVar,
        cells     = [], display,
        numVars   = this.state.numVars,
        nCells    = Math.pow( 2, numVars ),
        table     = this.state.table,
        rows      = [];

    for( var i = 0; i < nCells; i++ ) {
      display = STATE_DISPLAY[ table[ i ] ];
      console.log("The state of cell", i, "is", table[i] );
      cells[ i ] = (<KarnaughCell key={ i } ref={ "" + i } index={ i } state={ table[i] } update={ updateVar } />);
    }

    if( numVars == 2 ) {
      // first row, m0 m2
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 0 ], cells[ 2 ] ]
      }</div>);

      // second row, m1 m3
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 1 ], cells[ 3 ] ]
      }</div>);
    } else if( numVars == 3 ) {
      // first row, m0 m2 m6 m4
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 0 ], cells[ 2 ], cells[ 6 ], cells[ 4 ] ]
      }</div>);

      // second row, m1 m3 m5 m3
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 1 ], cells[ 3 ], cells[ 7 ], cells[ 5 ] ]
      }</div>);
    } else if( numVars == 4 ) {
      // first row, m0 m4 m12 m8
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 0 ], cells[ 4 ], cells[ 12 ], cells[ 8 ] ]
      }</div>);

      // second row, m1 m5 m13 m9
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 1 ], cells[ 5 ], cells[ 13 ], cells[ 9 ] ]
      }</div>);

      // third row, m3 m7 m15 m11
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 3 ], cells[ 7 ], cells[ 15 ], cells[ 11 ] ]
      }</div>);

      // fourth row, m2 m6 m14 m10
      rows.push(<div className="React-KarnaughMap-Row">{
        [ cells[ 2 ], cells[ 6 ], cells[ 14 ], cells[ 10 ] ]
      }</div>);
    }

    //console.log("Returning the map...");
    return (<div ref="wrapper"
                 className="React-KarnaughMap"
                 onKeyDown={ this.onKeyDown }
                 onKeyUp={ this.onKeyUp }>
      { rows }
    </div>); // React will complain here about lack of keys for this array -- fix later
  }
});

module.exports = KarnaughMap;