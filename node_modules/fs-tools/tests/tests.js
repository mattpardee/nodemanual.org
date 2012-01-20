'use strict';


// modules
var assert = require('assert'),
    path = require('path'),
    exec = require('child_process').exec,
    fstools = require('..');


var SANDBOX = __dirname + '/sandbox';


function cloneSandbox(name, cb) {
  var src = SANDBOX + '/template',
      dst = SANDBOX + '/' + name;
  exec('cp -rf ' + src + ' ' + dst, cb);
}

function dropSandbox(name, cb) {
  exec('rm -rf ' + SANDBOX + '/' + name, cb);
}

function reportError(err) {
  console.error(err.stack || err.message || err.toString());
}


cloneSandbox('remove', function (err) {
  if (err) {
    reportError(err);
    return;
  }

  if (!path.existsSync(SANDBOX + '/remove')) {
    reportError(Error("Sandbox not created"));
    return;
  }

  fstools.remove(SANDBOX + '/remove', function (err) {
    if (err) {
      reportError(err);
      return;
    }

    if (path.existsSync(SANDBOX + '/remove')) {
      console.log('remove() FAIL');
    } else {
      console.log('remove() PASS');
    }

    dropSandbox('remove', function (err) {
      if (err) {
        reportError(err);
        return;
      }
    });
  });
});


cloneSandbox('copy-src', function (err) {
  if (err) {
    reportError(err);
    return;
  }

  if (!path.existsSync(SANDBOX + '/copy-src')) {
    reportError(Error("Sandbox not created"));
    return;
  }

  var src = SANDBOX + '/copy-src', dst = SANDBOX + '/copy-dst';

  fstools.copy(src, dst, function (err) {
    if (err) {
      reportError(err);
      return;
    }

    exec('cd ' + src + ' && tree .', function (err, src_out) {
      if (err) {
        reportError(err);
        return;
      }

      exec('cd ' + dst + ' && tree .', function (err, dst_out) {
        if (err) {
          reportError(err);
          return;
        }

        if (src_out === dst_out) {
          console.log('copy() PASS');
        } else {
          console.log('copy() FAIL');
        }

        dropSandbox('copy-src', function (err) {
          if (err) {
            reportError(err);
            return;
          }

          dropSandbox('copy-dst', function (err) {
            if (err) {
              reportError(err);
              return;
            }
          });
        });
      });
    });
  });
});
