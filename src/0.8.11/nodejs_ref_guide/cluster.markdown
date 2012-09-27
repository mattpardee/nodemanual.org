## cluster

> Stability: 1 - Experimental

A single instance of Node runs in a single thread. To take advantage of
multi-core systems the user will sometimes want to launch a cluster of Node
processes to handle the load. 

To use this module, add `require('cluster')` to your code.

Note: This feature was introduced recently, and may change in future versions. Please try it out and provide feedback.

##### How It Works

Worker processes are spawned using the [[child_process.fork `child_process.fork()`]] method,
so that they can communicate with the parent via IPC and pass server
handles back and forth.

When you call `server.listen(...)` in a worker, it serializes the
arguments and passes the request to the master process.  If the master
process already has a listening server matching the worker's
requirements, it passes the handle to the worker.  If it does not
already have a listening server matching that requirement, it creates one, 
and passes the handle to the child.

This causes potentially surprising behavior in three edge cases:

1. `server.listen({fd: 7})`: Because the message is passed to the master,
   file descriptor 7 **in the parent** will be listened on, and the
   handle passed to the worker, rather than listening to the worker's
   idea of what the number 7 file descriptor references.
2. `server.listen(handle)`: Listening on handles explicitly will cause
   the worker to use the supplied handle, rather than talk to the master
   process.  If the worker already has the handle, then it's presumed
   that you know what you are doing.
3. `server.listen(0)`: Normally, this causes servers to listen on a
   random port.  However, in a cluster, each worker will receive the
   same "random" port each time they do `listen(0)`.  In essence, the
   port is random the first time, but predictable thereafter.  If you
   want to listen on a unique port, generate a port number based on the
   cluster worker ID.

When multiple processes are all `accept()`ing on the same underlying
resource, the operating system load-balances across them very
efficiently.  There is no routing logic in Node.js, or in your program,
and no shared state between the workers.  Therefore, it is important to
design your program such that it does not rely too heavily on in-memory
data objects for things like sessions and login.

Because workers are all separate processes, they can be killed or
re-spawned depending on your program's needs, without affecting other
workers.  As long as there are some workers still alive, the server will
continue to accept connections.  Node does not automatically manage the
number of workers for you, however.  It is your responsibility to manage
the worker pool for your application's needs.

#### Example: Launching one cluster working for each CPU

The cluster module allows you to easily create a network of processes that all
share server ports. 

Create a file called _server.js_ and paste the following code:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/cluster/server.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

By launching _server.js_ with the Node.js REPL, you can see that the workers are
sharing the HTTP port 8000:

    % node server.js
    Worker 2438 online
    Worker 2437 online


#### Example: Message passing between clusters and the master process

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/cluster/cluster.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### cluster@death(worker)
- worker {cluster}  The dying worker in the cluster

When any of the workers die, the cluster module emits this event. This can be
used to restart the worker by calling [[cluster.fork `cluster.fork()`]] again.

Different techniques can be used to restart the worker, depending on the
application.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/cluster/cluster.death.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### cluster.fork([env]), cluster.worker
- env {Object} Additional key/value pairs to add to child process environment.

Spawns a new worker process. This can only be called from the master process.

### cluster.isWorker, Boolean

Flag to determine if the current process is a worker process in a cluster. A
process is a worker if `process.env.NODE_WORKER_ID` is defined.

### cluster.isMaster, Boolean

Flag to determine if the current process is a master process in a cluster. A
process is a master if `process.env.NODE_WORKER_ID` is undefined.

### cluster@fork(worker)
- worker {cluster.worker} The worker that was forked

When a new worker is forked the cluster module will emit a 'fork' event. This
can be used to log worker activity, and create you own timeout.

#### Example

    var timeouts = [];
    var errorMsg = function () {
      console.error("Something must be wrong with the connection ...");
    });

    cluster.on('fork', function (worker) {
      timeouts[worker.uniqueID] = setTimeout(errorMsg, 2000);
    });
    cluster.on('listening', function (worker) {
      clearTimeout(timeouts[worker.uniqueID]);
    });
    cluster.on('death', function (worker) {
      clearTimeout(timeouts[worker.uniqueID]);
      errorMsg();
    });

### cluster@online(worker)
- worker {cluster.worker} The worker that becomes online

After forking a new worker, the worker should respond with a online message.
When the master receives a online message it emits this event.

The difference between `'fork'` and `'online'` is that fork is emitted when the
master tries to fork a worker, and `'online'` is emitted when the worker is
being executed.

#### Example

    cluster.on('online', function (worker) {
      console.log("Yay, the worker responded after it was forked");
    });

### cluster@listening(worker, address)
- worker {cluster.worker} The worker to listen for
- address {Object} Contains the `address` and `port` information where the worker is listening

When calling `listen()` from a worker, a 'listening' event is automatically assigned
to the server instance. When the server is listening, a message is sent to the master
where the 'listening' event is emitted.

#### Example

The event handler is executed with two arguments, the `worker` contains the
worker object and the `address` object contains the following connection properties:
`address`, `port` and `addressType`. This is very useful if the worker is
listening on more than one address.

    cluster.on('listening', function (worker, address) {
      console.log("A worker is now connected to " + address.address + ":" + address.port);
    });

### cluster@disconnect(worker)
- worker {cluster.worker} The worker that disconnected

When a worker's IPC channel has disconnected, this event is emitted. This
happens when the worker dies, usually after calling [[worker.destroy]].

When calling `disconnect()`, there may be a delay between the `disconnect` and
`death` events.  This event can be used to detect if the process is stuck in a
cleanup or if there are long-living connections.

#### Example

    cluster.on('disconnect', function(worker) {
      console.log('The worker #' + worker.uniqueID + ' has disconnected');
    });

### cluster@exit(worker, code, signal)
- worker {cluster.worker} The worker object
- code {Number} The exit code, if it exited normally
- signal {String} The name of the signal (eg. `'SIGHUP'`) that caused the process to be killed.

When any of the workers die, the cluster module emits the 'exit' event.
This can be used to restart the worker by calling `fork()` again.

    cluster.on('exit', function(worker, code, signal) {
      var exitCode = worker.process.exitCode;
      console.log('worker ' + worker.process.pid + ' died ('+exitCode+'). restarting...');
      cluster.fork();
    });


### cluster@setup(worker)
- worker {cluster.worker} The worker that executed

When the [[cluster.setupMaster `setupMaster()`]] function has been executed this
event emits. If [[cluster.setupMaster `setupMaster()`]] was not executed before [[cluster.fork `fork()`]], this function
calls `setupMaster()` with no arguments.

### cluster.setupMaster([settings])
- settings {Object} Various settings to configure. The properties on this
parameter are:
  * `exec`, the [[String `String`]] file path to worker file. The default is
`__filename`.
  * `args`, an  [[Array `Array`]] of string arguments passed to worker. The
default is `process.argv.slice(2)`.
  * `silent`, [[Boolean `Boolean`]] specifying whether or not to send output to
parent's stdio. The default is `false`.

`setupMaster` is used to change the default `'fork'` behavior. The new settings
are effective immediately and permanently, and they cannot be changed later on.

#### Example

    var cluster = require("cluster");
    cluster.setupMaster({
      exec : "worker.js",
      args : ["--use", "https"],
      silent : true
    });
    cluster.fork();

### cluster.disconnect([callback])
- callback {Function} Called when all workers are disconnected and handlers are
closed

When calling this method, all workers will commit a graceful suicide. After they
are disconnected, all internal handlers will be closed, allowing the master
process to die graceful if no other event is waiting.

### cluster.worker, Object

A reference to the current worker object. This is not available in the master process.

    var cluster = require('cluster');

    if (cluster.isMaster) {
      console.log('I am master');
      cluster.fork();
      cluster.fork();
    } else if (cluster.isWorker) {
      console.log('I am worker #' + cluster.worker.id);
    }

### cluster.workers, Object

A hash that stores the active worker objects, keyed by `id` field. It is only available in the master
process.

This makes it easy to loop through all the workers, like this:

    // Go through all workers
    function eachWorker(callback) {
      for (var uniqueID in cluster.workers) {
        callback(cluster.workers[uniqueID]);
      }
    }
    eachWorker(function (worker) {
      worker.send('big announcement to all workers');
    });

Should you wish to reference a worker over a communication channel, using the
worker's uniqueID is the easiest way to find the worker:

    socket.on('data', function (uniqueID) {
      var worker = cluster.workers[uniqueID];
    });

## worker < cluster

A `Worker` object contains all public information and methods about a worker. In
the master, it can be obtained using `cluster.workers`. In a worker it can be
obtained using `cluster.worker`.

### worker.id, String

Each new worker is given its own unique id, stored here.

While a worker is alive, this is the key that indexes it in `cluster.workers`.

### worker.process, child_process

Since all workers are created using [[child_process.fork
`child_process.fork()`]], the returned object from that function is stored in
`process`.

For more information, see the [[`child_process` module](child_process.html).

### worker.suicide, Boolean

This property is a boolean. It is set when a worker dies after calling
`destroy()` or immediately after calling the `disconnect()` method. Until then,
it is `undefined`.

### worker.send(message), Void
- message {Object} A message to send

This function is equal to the send methods provided by `child_process.fork()`.
In the master, you should use this function to
send a message to a specific worker.  However, in a worker you can also use
`process.send(message)`, since this is the same function.

#### Example: Echoing Back Messages from the Master

    if (cluster.isMaster) {
      var worker = cluster.fork();
      worker.send('hi there');

    } else if (cluster.isWorker) {
      process.on('message', function (msg) {
        process.send(msg);
      });
    }

### worker.destroy(), Void

This function kills the worker, and informs the master to not spawn a new worker.
To know the difference between suicide and accidentally death, a suicide boolean
is set to `true`.

    cluster.on('death', function (worker) {
      if (worker.suicide === true) {
        console.log('Oh, it was just suicide\' – no need to worry').
      }
    });

    // destroy worker
    worker.destroy();


### worker.disconnect(), Void

When calling this function the worker will no longer accept new connections, but
they will be handled by any other listening worker. Existing connection will be
allowed to exit as usual. When no more connections exist, the IPC channel to the
worker will close allowing it to die graceful. When the IPC channel is closed
the `disconnect` event will emit, this is then followed by the `death` event,
there is emitted when the worker finally die.

Because there might be long living connections, it is useful to implement a
timeout. This example ask the worker to disconnect and after two seconds it will
destroy the server. An alternative would be to execute `worker.destroy()` after
2 seconds, but that would normally not allow the worker to do any cleanup if
needed.

#### Example

    if (cluster.isMaster) {
      var worker = cluster.fork();
      var timeout;

      worker.on('listening', function () {
        worker.disconnect();
        timeout = setTimeout(function () {
          worker.send('force kill');
        }, 2000);
      });

      worker.on('disconnect', function () {
        clearTimeout(timeout);
      });

    } else if (cluster.isWorker) {
      var net = require('net');
      var server = net.createServer(function (socket) {
        // connection never end
      });

      server.listen(8000);

      server.on('close', function () {
        // cleanup
      });

      process.on('message', function (msg) {
        if (msg === 'force kill') {
          server.destroy();
        }
      });
    }

### worker@message(message)
- message {Object} The message to send

This event is the same as the one provided by `child_process.fork()`. In the
master you should use this event, however in a worker you can also use
`process.on('message')`

#### Example

Here is a cluster that keeps count of the number of requests in the master
process using the message system:

    var cluster = require('cluster');
    var http = require('http');

    if (cluster.isMaster) {

      // Keep track of http requests
      var numReqs = 0;
      setInterval(function() {
        console.log("numReqs =", numReqs);
      }, 1000);

      // Count requestes
      var messageHandler = function (msg) {
        if (msg.cmd && msg.cmd == 'notifyRequest') {
          numReqs += 1;
        }
      };

      // Start workers and listen for messages containing notifyRequest
      var numCPUs = require('os').cpus().length;
      for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

    } else {

      // Worker processes have a http server.
      http.Server(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");

        // notify master about the request
        process.send({ cmd: 'notifyRequest' });
      }).listen(8000);
    }

### worker@online(worker)
- worker {cluster.worker} The worker that came online

Same as a cluster's [[cluster@online `'online'`]] event, but emits only when the
state changes on the specified worker.

#### Example

    cluster.fork().on('online', function (worker) {
      // Worker is online
    };

### worker@listening@listening(address)
- address {Object} Contains the `address` and `port` information where the worker is listening

Same as the [[cluster@listening]] event, but emits only when the state change on the specified worker.

#### Example

    cluster.fork().on('listening', function (address) {
      // Worker is listening
    };

### worker@disconnect(worker)
- worker {cluster.worker} The disconnected worker

Same as the [[cluster@disconnect `cluster.on('disconnect')`]] event, but emits only when the state
change on the specified worker.

    cluster.fork().on('disconnect', function (worker) {
      // Worker has disconnected
    };

### worker@exit(code, signal)
- code {Number} The exit code, if exited normally
- signal {String} The name of the signal, (_e.g._ `'SIGHUP'`) that caused
  the process to be killed.

Emitted by the individual worker instance, when the underlying child process
is terminated.  For more information, see [[child_process@exit child_process' `'exit'` event].

    var worker = cluster.fork();
    worker.on('exit', function(code, signal) {
      if( signal ) {
        console.log("worker was killed by signal: "+signal);
      } else if( code !== 0 ) {
        console.log("worker exited with error code: "+code);
      } else {
        console.log("worker success!");
      }
    };
