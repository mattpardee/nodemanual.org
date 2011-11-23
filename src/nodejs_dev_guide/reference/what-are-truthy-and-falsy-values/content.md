## Defining "Truthy" and "Falsy" values

Javascript is weakly typed language. That means different types can be used in operations and the language will try to convert the types until the operation makes sense. For example, look at the following code:

    console.log("1" > 0); // true, "1" converted to number
    console.log(1 + "1"); // 11, 1 converted to string

In the first example, the `>` operator expected two binary values, so Javascript converts the string numeral `"1"` into a `Number`. Similarly, in the second example, the numeral 1 is converted into a string, so that the concatenation with the `+` operator makes sense.

Type conversion also applys when values are used in unary boolean operations, most notably `if` statements. If a value converts to the boolean `true`, then it is said to be "truthy." If it converts to `false`, it is "falsy." For example:

    var myval = "value";
    if(myval) 
    {
        console.log("This value is truthy");
    }
    
    myval = 0;
    if(!myval) 
    {
        console.log("This value is falsy");
    }

Since most values in Javascript are truthy, like objects, arrays, most numbers and strings, it's easier to just list all of the falsy values. These are:

    false // obviously
    0     // The only falsy number
    ""    // the empty string
    null
    undefined
    NaN
    
**Note**: all objects and arrays are truthy, even empty ones.

Truthiness and falsiness also come into play with logical operators. When using the logical AND/OR operators, the values are converted based on truthiness or falsiness, and normal short circuit rules applu. The logical expression resolves to the last truthy value in the sequence. Here's an extended example demonstrating this:

    var first = "truthy"
      , second = "also truthy";

    var myvalue = first && second;
    console.log(myvalue); // "also truthy"

    first = null;
    second = "truthy";

    myvalue = first || second;
    console.log(myvalue); // "truthy"

    myvalue2 = second || first;
    console.log(myvalue2); // "truthy"

    var truthy = "truthy"
      , falsy = 0;

    myvalue = truthy ? true : false;
    myvalue = falsy ? true : false;
    