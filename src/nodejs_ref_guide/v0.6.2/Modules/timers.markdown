## Timers

The timer functions are useful for scheduling functions to run after a defined amount of time. It is important to note that your callback will probably *not* be called in exactly `delay` milliseconds. Node.js makes no guarantees about the exact timing of when the callback is fired, nor of the ordering things will fire in. The callback is called as close as possible to the time specified.

### Methods

@method `clearInterval(intervalId)`
@param `intervalId`: The id of the interval

Stops a interval from triggering.

@method `clearTimeout(timeoutId)`
@param `timeoutId`: The id of the timeout

Prevents a timeout from triggering.

@method `setInterval(callback, delay, [arg...])`
@param `callback()`: The callback function to execute, `delay`: The delay (in milliseconds) before executing the callback, `[arg...]`: Any optional arguments to pass the to callback

This schedules the repeated execution of a callback function after a defined delay. It returns a `intervalId` for possible use with `clearInterval()`. Optionally, you can also pass arguments to the callback.

@method `setTimeout(callback(), delay, [arg...])`
@param `callback()`: The callback function to execute, `delay`: The delay (in milliseconds) before executing the callback, `[arg...]`: Any optional arguments to pass the to callback

This function schedules the execution of a one-time callback function after a defined delay, It returns a `timeoutId`, which can be used later with `clearTimeout()`. Optionally, you can also pass arguments to the callback.