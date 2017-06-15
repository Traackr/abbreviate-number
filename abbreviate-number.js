/*
 * abbreviate-number.js - Javascript module to abbreviate number (3.7K, 7.8M, etc.)
 *
 * Follows the UMD pattern
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

  // ---- MODULE START -----

  /*
   * Default behavior and how to alter it
   */

  // Do we want to add commas? (eg. 1,2345,456 or 1,567K)
  // --
  // You can alter the defaults by setting the 'addCommas'
  // param when calling abbreviate() or commatize().
  var DEFAULT_ADD_COMMAS = true,

  // How many maximum fractional digits to we want to show?
  // How many overall meaningful digit do we want to guarantee?
  // --
  // If the fractional part ends with zeros, they are discarded.
  // The actual fractional part kept is also dependent on the number
  // of meaningful digits we want to surface.
  // --
  // For example, if the number to abbreviate is 345.123 and
  // we want 1 max fractional digits but only want 3 meaningful
  // digits, we cannot show the fractional part because "345" is
  // already 3 meaningful digits.
  // --
  // You can alter the defaults by setting the 'maxFractionalDigits'
  // and 'meaningfulDigits' params when calling abbreviate().
      DEFAULT_MAX_FRACTIONAL_DIGITS = 1,
      DEFAULT_MEANINGFUL_DIGITS = 3,

  // In auto-mode, large numbers are abbreviating using standard
  // K,M,B or T units.
  // It's possible to force the number to be abbreviated in a specific
  // unit by setting the 'forceUnit' param when calling abbreviate().
  // An empty string value means "do not abbreviate with units".
  // For example, 12345 would be formatted as 12,345.
      DEFAULT_FORCE_UNIT = "auto", // K,M,B,T,empty string or auto

  // Do not abbreviate numbers under a certain threshold.
  // By default, we always abbreviate (0 value).
  // --
  // You can alter the defaults by setting the 'noAbbrevUnder'
  // param when calling abbreviate().
      DEFAULT_NO_ABBREV_UNDER = 0;

  var UNITS = [ "", "K", "M", "B", "T" ];

  /**
   * Abbreviate a number
   * @param  {number|string} n Number to abbreviate. If string, must contain a valid number.
   * @param  {Object} [params] Optional parameters. Allowed keys:
   *   {bool}   addCommas           True by default.
   *   {string} forceUnit           "auto" by default. Allowed: K,M,B,T or empty string (no abbrev)
   *   {int}    maxFractionalDigits If zero, no fractional part. Default is 1.
   *   {int}    meaningfulDigits    Minimum number of digits we'd like to have, incl. fractional part.
   *   {int}    noAbbrevUnder       Threshold below which, no abbreviation takes place. Default=0
   * @return {string} Abbreviated number
   */
  function abbreviate( n, params ) {
    if (!n || isNaN(n) ) return "";
    n = +n; // cast to number if string containing a number
    if ( n===0 ) return "0";
    if ( n<0 ) return "-"+abbreviate( -n, params );

    params = params || {};

    var addCommas = typeof(params.addCommas) === "undefined" ? DEFAULT_ADD_COMMAS : params.addCommas,
        forceUnit = typeof(params.forceUnit) === "undefined" ? DEFAULT_FORCE_UNIT : params.forceUnit,
        maxFractionalDigits = typeof(params.maxFractionalDigits) === "undefined" ? DEFAULT_MAX_FRACTIONAL_DIGITS : params.maxFractionalDigits,
        meaningfulDigits = typeof(params.meaningfulDigits) === "undefined" ? DEFAULT_MEANINGFUL_DIGITS : params.meaningfulDigits,
        noAbbrevUnder = typeof(params.noAbbrevUnder) === "undefined" ? DEFAULT_NO_ABBREV_UNDER : params.noAbbrevUnder,
        rounded = n, unit, unitIndex, divider;

    if ( n < noAbbrevUnder ) {
      forceUnit="";
    }

    if ( forceUnit === "auto" ) {
      unitIndex=Math.floor(Math.log10(n)/3);
    } else {
      unitIndex = UNITS.indexOf(forceUnit);
    }

    if ( unitIndex < 0 ) {
      unitIndex=0;
    } else if ( unitIndex >= UNITS.length ) {
      unitIndex=UNITS.length-1;
    }
    divider=Math.pow(1000,unitIndex);
    unit=UNITS[unitIndex];

    rounded=n/divider;

    // Only keep fractional part if not enough
    // meaningful digits in the integer part.
    rounded=round(
      rounded,
      // If there is a large integer part, there is less available
      // room to show fractional digits (even if desirable).
      // Ex: 123.45 => 123    if meaningfulDigits is set to 3
      //      23.45 =>  23.5  if meaningfulDigits is set to 3
      //       3.45 =>   3.5  if maxFractionalDigits set to 1
      //       3.45 =>   3.45 if maxFractionalDigits set to 2
      Math.min(
        maxFractionalDigits,
        // If negative, there is no room for showing a fractional part
        Math.max(
          0,
          // The right part counts how many digts in the integer part
          meaningfulDigits-Math.floor(Math.log10(rounded))-1
        )
      )
    );

    if ( addCommas ) {
      return commatize(rounded) + unit;
    }
    return "" + rounded + unit;
  }

  /**
   * Add commas to separate powers of 1000. Fractional part supported.
   * @param  {number|string} n Number (can be fractional) or string containing a number
   * @return {string} Number with commas
   */
  function commatize( n ) {
    return (n + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
      return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
    });
  }

  /**
   * Round a number at a certain fractional level.
   * @param  {number} n Number (can be fractional)
   * @param  {int}    fractionalDigits Number of fractional digits to keep.
   *                  (if zero, behaves like Math.round())
   * @return {number} Rounded number
   */
  function round(n, fractionalDigits ) {
    return Math.round( n * Math.pow(10,fractionalDigits ) )/Math.pow(10,fractionalDigits);
  }

  // --- MODULE END ---

  // What gets exported to the outside world... (UMD pattern)
  return {
    abbreviate: abbreviate,
    commatize: commatize
    };
  }
));
