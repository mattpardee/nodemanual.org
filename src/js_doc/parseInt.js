/** section: Javascript_Global_Methods
 * parseInt(string[, _radix_]) -> Number
 * - string (String): The value to parse. If string is not a string, then it is converted to one. Leading whitespace in the string is ignored.
 * - radix (Number): An integer that represents the radix of the above mentioned string. While this parameter is optional, always specify it to eliminate reader confusion and to guarantee predictable behavior. Different implementations produce different results when a radix is not specified.
 *
 * parseInt is a top-level function and is not associated with any object.
 *
 * The parseInt function converts its first argument to a string, parses it, and returns an integer or [[NaN `NaN`]]. If not `NaN`, the returned value will be the decimal integer representation of the first argument taken as a number in the specified radix (base). For example, a radix of 10 indicates to convert from a decimal number, 8 octal, 16 hexadecimal, and so on. For radices above 10, the letters of the alphabet indicate numerals greater than 9. For example, for hexadecimal numbers (base 16), A through F are used.
 *
 * If `parseInt()` encounters a character that is not a numeral in the specified radix, it ignores it and all succeeding characters and returns the integer value parsed up to that point. parseInt truncates numbers to integer values. Leading and trailing spaces are allowed.
 *
 * If radix is undefined or 0, JavaScript assumes the following:
 *
 * * If the input string begins with "0x" or "0X", radix is 16 (hexadecimal)
 * * If the input string begins with "0", radix is eight (octal). This feature is non-standard, and some implementations deliberately do not support it (instead using the radix 10). For this reason always specify a radix when using parseInt.
 * * If the input string begins with any other value, the radix is 10 (decimal).
 *
 * If the first character cannot be converted to a number, parseInt returns `NaN`.
 *
 * For arithmetic purposes, the NaN value is not a number in any radix. You can call the [[NaN `isNaN()`]] function to determine if the result of parseFloat is `NaN`. If `NaN` is passed on to arithmetic operations, the operation results will also be `NaN`.
 *
 * To convert number to its string literal in a particular radix use `intValue.toString(radix)`.
 *
 * #### Example: Using `parseInt`
 * 
 * 
 *     parseInt(" 0xF", 16);
 *     parseInt(" F", 16);
 *     parseInt("17", 8);
 *     parseInt(021\. 8);
 *     parseInt("015", 10);
 *     parseInt(15.99\. 10);
 *     parseInt("FXX123", 16);
 *     parseInt("1111", 2);
 *     parseInt("15*3", 10);
 *     parseInt("15e2", 10);
 *     parseInt("15px", 10);
 *     parseInt("12", 13);
 *     
 *  The following examples all return `NaN`:
 *
 *    
 *     parseInt("Hello", 8); // Not a number at all
 *     parseInt("546", 2);   // Digits are not valid for binary representations
 * 
 * The following examples all return `-15:`
 *   
 *     parseInt("-F", 16);
 *     parseInt("-0F", 16);
 *     parseInt("-0XF", 16);
 *     parseInt(-10\. 16);
 *     parseInt(-15.1\. 10)
 *     parseInt(" -17", 8);
 *     parseInt(" -15", 10);
 *     parseInt("-1111", 2);
 *     parseInt("-15e1", 10);
 *     parseInt("-12", 13);
 *   
 * The following example returns `224:`
 *    
 *     parseInt("0e0", 16);
 *    
 * #### See also
 *
 * * [[parseInt `parseInt()`]]
 * * [[Object.valueOf `Object.valueOf()`]]
 * * [[Number.toString `Number.toString()`]]
 *
 *
 **/

