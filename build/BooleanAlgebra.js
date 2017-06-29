/**
 * Parses an integer from a binary string of digits. Returns false if
 * the given input is invalid or if it greater than the given max value.
 *
 * @param {String} input  The binary string to interpret
 * @param {Number} max    The maximum output value to allow
 *
 * @return {Number}  A base-ten representation of the input binary string
 */
var parseBinary = function( input, max ) {
  var result = parseInt( input, 2 );

  return ( isNaN( result ) || result > max ) ? false : result;
};

/**
 * Converts an integer to its binary representation in the form of a 
 * boolean array.
 * 
 * @param {Number} integer  An integer to convert to binary
 *
 * @return {Boolean[]}
 *   An array of booleans of length n such that the boolean at index 0
 *   represents the least significant bit and the boolean at index n - 1
 *   represents the most significant bit.
 */
var toBinaryArray = function( integer, size ) {
  var out = [];

  while( integer ) {
    out.unshift( !!(integer % 2) );
    integer = Math.floor( integer / 2 );
  }

  // push 'false' onto the end until size is met
  if( size ) {
    while( out.length < size ) out.unshift( false );
  }

  return out;
};

var toDecimal = function( binaryArray ) {
  var result = 0, pow = 1;

  // make a copy, to be safe
  binaryArray = binaryArray.concat([]);
  
  // while there's still an element in the array
  while( binaryArray.length ) {
    if( binaryArray.pop() ) {
      result += pow; // if the element = 1, add this power of 2
    }
    pow *= 2;
  }

  return result;
};

/**
 * Counts the occurrences of [thing] in [array].
 * 
 * @param {*}       thing   The thing to search for
 * @param {Array}   array   The array in which to search
 * @param {Boolean} negate  true if anything that ISN'T [thing] should be counter
 * 
 * @return {Number}  How many times [thing] occurs in [array]
 */
var count = function( thing, array, negate ) {
  return array.reduce(function( count, element ) {
    var countThis = ( element === thing ) ^ negate;
    return count + ( countThis ? 1 : 0 );
  }, 0 );
};

/**
 * Creates a new representation of an implicant to be used when minifying
 * a function. The states array represents, in order, the value of the
 * variables in the implicant (undefined meaning the variable is not present).
 * For example, in the four variable system whose variables are named
 * a, b, c, and d, the implicant ~bc (NOT b AND c) is represented
 * by the state array [ undefined, 0, 1, undefined ].
 * 
 * @param {Array} states  The values of variables in this implicant
 * 
 * @constructor
 */
var Implicant = function( states ) {
  this.space = states.length;
  this.length = count( undefined, states, true ); // count non-undefined
  this.states = states;

  // determine the term if there are no undefineds
  // ( no undefineds means this is a term )
  if( count( undefined, states ) === 0 ) {
    this.terms = [ toDecimal( states ) ];
  }
};

Implicant.prototype = {
  equals: function( implicant ) {
    var space = this.space,
        equal = space       === implicant.space
             && this.length === implicant.length,

        tState = this.states,
        oState = implicant.states;

    for( var i = 0; equal && i < space; i++ ) {
      equal = tState[ i ] === oState[ i ];
    }

    return equal;
  },

  isTerm: function() {
    return this.terms.length;
  },

  contains: function( implicant ) {
    var contains = false,
        tStates = this.states,
        oStates = implicant.states,
        t, o;

    // space must be the same
    if( this.space !== implicant.space ) {
      contains = false;
    }

    // 'this' must be more general than 'implicant'
    // that is any 1's and 0's in 'this' must be
    // matched in 'implicant' (and 'implicant' must
    // not have any undefined's where 'this' doesn't)
    for( var i = 0; i < this.space; i++ ) {
      t = tStates[ i ];
      o = oStates[ i ];

      if( t !== undefined ) {
        // if t is a value, o must match
        contains = o === t;
      }
    }
  },

  canJoinWith: function( implicant ) {
    var valid = true,
        tStates = this.states,
        oStates = implicant.states,
        t, o,
        foundDifferent = false;

    // space and length must be the same
    if( this.space !== implicant.space 
     || this.length !== implicant.length ) {
      valid = false;
    }

    // now, they must have the same variables undefined
    // and only one variable can be different
    for( var i = 0; valid && i < this.space; i++ ) {
      t = tStates[ i ];
      o = oStates[ i ];

      if( t === undefined ) {
        // undefined variables must match
        valid = o === undefined;
      } else if( foundDifferent ) {
        // already found a different pair, so these must match
        valid = t === o;
      } else if( t !== o ) {
        // haven't found a different pair
        // if this pair is different, make note
        foundDifferent = true;
        this.lastJoinIndex = i; // quick-save this for use inside join()
      }
    }

    return valid && foundDifferent;
  },

  joinedWith: function( implicant ) {
    var newStates, newImplicant;

    if( !this.canJoinWith( implicant ) ) {
      delete this.lastJoinIndex;
      return undefined;
    }

    // otherwise, .canJoinWith will set the value
    // of the property .lastJoinIndex to the index
    // of the variable to join
    newStates = this.states.map(function( val ) {
      return val;
    });

    // and replace the different one with undefined
    newStates[ this.lastJoinIndex ] = undefined;
    
    // clean up
    delete this.lastJoinIndex;
    
    // make the implicant, note the terms to which it applies
    newImplicant = new Implicant( newStates );
    newImplicant.terms = this.terms.concat( implicant.terms );
    
    // return the new implicant!
    return newImplicant;
  }
};

var ArrayPrototype = Array.prototype;

var ImplicantList = function() {
  ArrayPrototype.constructor.call( this );
};

ImplicantList.prototype = new Array();

ImplicantList.prototype.addAll = function( array ) {
  var self = this;

  array.forEach(function( val ) {
    // either it contains this implicant, or add it
    self.contains( val ) || self.push( val );
  });
};

ImplicantList.prototype.indexOf = function( impl ) {
  var index = -1;
    
  for( var i = 0; index === -1 && i < this.length; i++ ) {
    if( impl.equals( this[ i ] ) ) index = i;
  }

  return index;
};

ImplicantList.prototype.contains = function( impl ) {
  return this.indexOf( impl ) !== -1;
};

ImplicantList.prototype.empty = function() {
  while( this.length ) this.pop();
};

/**
 * Determines the implicants of the function described by the given table.
 * Whether 0's or 1's are targeted is determined by the value of [target].
 * The returned implicants are objects such that at each of the relevant
 * indices corresponding to variables (ie, in a three variable system, 0,
 * 1, and 2) are either true, false, or undefined; true meaning 1, false
 * meaning 0, and undefined meaning the variable is not part of that
 * implicant.
 *
 * This function also marks whether an implicant is prime and / or essential.
 *
 * @param {Boolean[]} table   The truth table to analyze
 * @param {Number}    size    The number of variables in the system
 * @param {Boolean}   target  true if 1's should be targeted, false otherwise
 *
 * @return {ImplicantList}
 *   An array of implicants.
 */
var getImplicants = function( table, size, target ) {
  var implicants = new ImplicantList(),

      // how many vars are included in each implicant
      roundSize = size - 1,

      // the implicants of this and last round
      thisRound, lastRound, lastLen, i, j, joined;

  // initialize the first implicants
  thisRound = [];

  for( i = 0; i < table.length; i++ ) {
    if( table[ i ] === target || table[ i ] === undefined ) {
      thisRound.push( new Implicant( toBinaryArray( i, size ) ) );
    }
  }

  //implicants = [].concat( thisRound );
  implicants.addAll( thisRound );
  
  // go down in size until 0, check thisRound.length to exit early if need be
  // (it's pointless to keep iterating if the last iteration yielded no implicants)
  while( roundSize >= 0 && thisRound.length /* > 0 */ ) {
    //console.log("Now beginning size " + roundSize);
    // lastRound references the last iteration's implicants
    lastRound = thisRound;
    lastLen = lastRound.length;

    // initially mark all of last round's implicants as prime
    lastRound.forEach(function( implicant ) {
      implicant.prime = true;
    });

    // thisRound is a new list of implicants
    thisRound = [];

    // now, painstakingly bubble-check for implicants that can join
    for( i = 0; i < lastLen - 1; i++ ) {
      for( j = i + 1; j < lastLen; j++ ) {
        joined = lastRound[ i ].joinedWith( lastRound[ j ] );

        if( joined ) {
          thisRound.push( joined );
          lastRound[ i ].prime = false;
          lastRound[ j ].prime = false;
        }
      }
    }

    // concatenate these implicants onto the array
    implicants.addAll( thisRound );
    roundSize--;
  }
  
  return implicants;
};

/**
 * Creates a representation of a boolean function from a given
 * truth table and using the given variable names. Additionally,
 * this constructor calls upon numerous other functions to
 * obtain various other representations of the input function.
 * 
 * @param {Number}    vars   The number of variables present in the function
 * @param {Boolean[]} table  The output values of the function (true is 1)
 * 
 * @constructor
 */
var BooleanFunction = function( size, table ) {
  var self = this;
  
  // save some data variables
  this.size = size;
  this.length = table.length; // should = size^2

  // to hold the min- and maxterms associated with this function
  this.minterms = [];
  this.minImplicants = getImplicants( table, size, true );
  this.maxterms = [];
  this.maxImplicants = getImplicants( table, size, false );

  // determine the minified form of this function
  //this.minified = ?
  
  // map the values of the given table to this object,
  // determine the minterms and maxterms associated with this function
  table.forEach(function( value, index ) {
    // save the value
    self[ index ] = value;
    
    // if value == 1, push to minterms; else, push to maxterms
    if( value === undefined ) {
      self.minterms.push( index );
      self.maxterms.push( index );
    } else {
      self[ value ? "minterms" : "maxterms" ].push( index );
    }
  });
};

BooleanFunction.prototype = {
  isMinterm: function() {
    return this.minterms.length == 1;
  },

  isMaxterm: function() {
    return this.maxterms.length == 1;
  },

  toString: function() {
    return this.minified;
  }
};

module.exports = {
  BooleanFunction: BooleanFunction
};