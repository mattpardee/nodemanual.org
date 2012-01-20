fs-tools
========

Useful file utitiles. See [API Documentation](http://nodeca.github.com/fs-tools/FsTools/index.html) for detailed info.

---

### walk(path, [pattern,] iterator[, callback])

Recurcively scan files by regex pattern & apply iterator to each. Iterator applyed only to files, not to directories.

    fstools.walk('/home/nodeca', '\.yml$', function (path, stats, callback) {
      fs.readFile(path, 'utf-8', funtion (err, str) {
        if (err) {
          callback(err);
          return;
        }

        console.log(str);
        callback();
      });
    }, function (err) {
      if (err) {
        console.error(err);
      }

      console.log('Done!');
    });

### remove(path, callback)

Recursively delete directory with all content.

    fstools.remove('/home/nodeca/trash', function (err) {
      if (err) {
        console.log("U can't touch that");
        console.err(err);
        process.exit(1);
      } else {
        console.log("It's Hammer time");
        process.exit(0);
      }
    });

### mkdir(path, mode = '0755', callback)

Recursively make path.

    fstools.mkdir('/home/nodeca/media/xxx', function (err) {
      if (err) {
        console.log("Can't' create directory");
        console.err(err);
        process.exit(1);
      } else {
        console.log("We can now store some romantic movies here");
        process.exit(0);
      }
    });

### copy(src, dst, callback)

Copy file. Not optimized for big sourses (read all to memory at once).

    var src = '/home/nodeca/secrets.yml',
        dst = '/home/nodeca/very/deep/secrets/main.yml';

    fstools.copy(src, dst, function (err) {
      if (err) {
        console.log("Failed to copy " + src + " into " + dst);
        console.err(err);
        process.exit(1);
      } else {
        console.log("Fone!");
        process.exit(0);
      }
    });

## License

View the [LICENSE](https://github.com/nodeca/fs-tools/blob/master/LICENSE) file (MIT).
