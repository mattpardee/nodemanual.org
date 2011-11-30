## Assert

This module is used for writing unit tests for your applications. You can access it by adding `require('assert')` to your code.

@method `assert.fail(actual, expected, message, operator)`
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console, `operator`: The operator used to separate the `actual` and `expected` values in the `message`

Throws an exception that displays the values for `actual` and `expected` separated by the provided operator.

@method `assert(value, message), assert.ok(value, [message])`
@param `value`: The value you receive, `message`: The message to send to the console

Tests if value is a `true` value. This is equivalent to `assert.equal(true, value, message);`

@method `assert.equal(actual, expected, [message])`
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console

Tests shallow, coercive equality with the equal comparison operator ( `==` ).

@method `assert.notEqual(actual, expected, [message])`
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console

Tests shallow, coercive non-equality with the not equal comparison operator ( `!=` ).

@method `assert.deepEqual(actual, expected, [message])`
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console

Tests for deep equality.

@method assert.notDeepEqual(actual, expected, [message])
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console

Tests for any deep inequality ,,

@method `assert.strictEqual(actual, expected, [message])`
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console

Tests strict equality, as determined by the strict equality operator ( `===` )

@method `assert.notStrictEqual(actual, expected, [message])`
@param `actual`: The value you receive, `expected`: The expected value you're looking for, `message`: The message to send to the console

Tests strict non-equality, as determined by the strict not equal operator ( `!==` )

@method `assert.throws(block, [error], [message])`
@param `block`: A block of code to check against, `error`: The expected error that's thrown; this can be a constructor, regexp, or validation function, `message`: The message to send to the console

Expects `block` to throw an error.

#### Examples

Validate `instanceof` using a constructor:

    assert.throws(
      function() {
        throw new Error("Wrong value");
      },
      Error
    );

Validate error message using RegExp:

    assert.throws(
      function() {
        throw new Error("Wrong value");
      },
      /value/
    );

Custom error validation:

    assert.throws(
      function() {
        throw new Error("Wrong value");
      },
      function(err) {
        if ( (err instanceof Error) && /value/.test(err) ) {
          return true;
        }
      },
      "unexpected error"
    );

@method `assert.doesNotThrow(block, [error], [message])`
@param `block`: A block of code to check against, `error`: The expected error that's thrown; this can be a constructor, regexp, or validation function, `message`: The message to send to the console

Expects `block` not to throw an error; for more details, see `assert.throws()`.

@method `assert.ifError(value)`
@param `value`: The value to check against

Tests if value is `false`; throws an error if it is `true`. Useful when testing the first argument, `error`, in callbacks.
