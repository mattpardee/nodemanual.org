# Understanding `try/catch`

Javascript's `try-catch-finally` statement works very similarly to the `try-catch-finally` encountered in C++ and Java.  It's best to describe this concept with an example:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/try_catch/using.try.catch.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

The results of this code block are:

    entering try-catch statement
    entering try block
    entering catch block
    thrown message
    leaving catch block
    entering and leaving the finally block
    leaving try-catch statement

First, the `try` block is executed. If an error is encountered, it immediately goes to the `catch` block, where the error is hangled.

If the code doesn't throw an exception, then the whole `try` block completes its execution. executed. After it's done, the `finally` block is executed. It's always executed, with or without an exception occuring.

Note that you must always have at least one `catch` or `finally` block, both both aren't required. In other words, these are legitimate:

    try {
        
    } catch (e)
    {
        
    }


    try {
        
    } finally {
        
    }

#### Is it Node.js convention to not use try-catch?

In the core Node.js libraries, the only place that one really **needs** to use a try-catch is around `JSON.parse()`. All of the other methods use either the standard `Error` object through the first parameter of the callback or emit an `error` event. Because of this, it is generally considered [standard convention](what-are-the-error-conventions.html) to return errors through the callback rather than to use the `throw` statement. 