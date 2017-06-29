/** @jsx React.DOM */
// set up of the page is performed in this file
var $           = require("jquery"),
    React       = require("react"),
    DOMUtil     = require("DOMUtil"),

    // react components
    InputBar    = require("components:InputBar"),
    KarnaughMap = require("components:KarnaughMap"),
    Sidebar     = require("components:Sidebar"),

    // DOM references
    inputContainer,   inputBar,
    contentContainer,
    mapContainer,     map,
    sidebarContainer, sidebar;

// validates input from the input bar
// returns a string describing the error if there is one
var validateInput = function( currentValue, previousValue ) {
  var cLen = currentValue.length,
      pLen = previousValue.length,
      deletion = pLen > cLen;
  
  if( !deletion && cLen === 1 && [ 'm', 'M', 'D' ].indexOf( currentValue ) !== -1 ) {
    this.value = currentValue + "()";
    DOMUtil.setCursor( this, 2 );
  }
};

var onMapChange = function( index, oldVal, newVal, newState ) {
  sidebar.forceUpdate();
};

var onWindowResize = function() {
  var height = window.innerHeight - inputContainer.outerHeight();
  contentContainer.outerHeight( height );
  mapContainer.css("padding-top", ( height - mapContainer.height() ) / 2 + "px" );
};

var onDOMReady = function onDOMReady() {
  var body = $("body");

  // get the DOM references
  inputContainer = $("#input-container");
  contentContainer = $("#content-container");
  mapContainer = $("#map-container");
  sidebarContainer = $("#sidebar-container");
  
  // create the input bar
  inputBar = React.renderComponent(
    InputBar({placeholder: "Type a min- or maxterm expression, and the K-Map will automatically reflect it", 
              validate: validateInput }),
    inputContainer[0]
  );
  
  // create the KMap
  map = React.renderComponent(
    KarnaughMap({ onChange: onMapChange }),
    mapContainer[0]
  );

  // create the sidebar component
  sidebar = React.renderComponent(
    Sidebar({map: map }),
    sidebarContainer[0]
  );
  
  // DEBUG -- allow access to the KMap
  window.map = map;
  
  // add event listeners
  window.addEventListener( "resize", onWindowResize );
  document.addEventListener( "keydown", function( ev ) {
    var code = ev.keyCode || ev.which;

    if( code >= 48 && code <= 90 ) {
      inputBar.focusInput();
    }
  });

  // position stuff
  onWindowResize();
};

$( onDOMReady );