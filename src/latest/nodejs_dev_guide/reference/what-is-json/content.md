# About JSON

Javascript Object Notation, or JSON, is a lightweight data format that has become the de-facto standard for the web, toppling the long and unweildy curse of XML. JSON can be represented as either a list of values, like an Array, or as a hash of properties and values, like an Object:

    // a JSON array
    ["one", "two", "three"]

    // a JSON object
    { "one": 1, "two": 2, "three": 3 }

You can view the full specifications of JSON on [the official website](http://www.json.org/).

#### Encoding and Decoding JSON

Javascript provides two methods for encoding data structures to JSON and encoding JSON back to javascript objects and arrays. They are both available on the `JSON` object that is available in the global scope.

`JSON.stringify()` takes a Javascript object or array and returns a serialized string in the JSON format. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=json.stringify.1.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

The full method declaration of `JSON.stringify()` is actually `JSON.stringify(obj [, replacer [, space]])`. You can pass in an optional function to replace elements in the JSON object, or define how much whitespace to present before an element. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=json.stringify.2.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

`JSON.parse()` does the reverse, taking a JSON string and decoding it to a Javascript data structure:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=json.parse.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

#### Defining Valid JSON

There are a few rules to remember when dealing with data in the JSON format:

* Empty objects and arrays are okay
* Strings can contain any unicode character, this includes object properties
* `null` is a valid JSON value on its own
* All object properties should always be double quoted
* Object property values must be one of the following: `String`, `Number`, `Boolean`, `Object`, `Array`, `null`
* Number values must be in decimal format, no octal or hex representations
* Trailing commas on arrays are not allowed

These are all examples of valid JSON.

    {"name":"John Doe","age":32,"title":"Vice President of Javascript"}

    ["one", "two", "three"]

    // nesting valid values is okay
    {"names": ["John Doe", "Jane Doe"] }
     
    [ { "name": "John Doe"}, {"name": "Jane Doe"} ]

    {} // empty hash

    [] // empty list

    null

    { "key": "\uFDD0" } // unicode escape codes

These are all examples of bad JSON formatting.

    // name and age should be in double quotes
    { name: "John Doe", 'age': 32 } 

    // hex numbers are not allowed
    [32, 64, 128, 0xFFF] 

    // undefined is an invalid value
    { "name": "John Doe", age: undefined } 

    // functions and dates are not allowed
    { "name": "John Doe"
      , "birthday": new Date('Fri, 26 Aug 2011 07:13:10 GMT')
      , "getName": function() {
          return this.name;
      }
    }

Calling `JSON.parse` with an invalid JSON string will result in a `SyntaxError` being thrown. If you are not sure of the validity of your JSON data, you can anticipate errors by wrapping the call in a `try/catch` block.

Notice that the only complex values allowed in JSON are objects and arrays. Functions, dates and other types are excluded. This may not seem to make sense at first. But remember that JSON is a data format, not a format for transfering complex javascript objects along with their functionality.

#### JSON in other languages

Although JSON was inspired by the simplicity of Javascript data structures, it's use is not limited to the Javascript language. Many other languages have methods of transfering native hashes and lists into stringified JSON objects. Here's a quick example in Ruby:

    require 'json'

    data = { :one => 1 }
    puts data.to_json

    # prints "{ \"one\": 1 }"