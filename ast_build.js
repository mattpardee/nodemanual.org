var panino = require("panino");
    
panino.main(["--path=./src/latest/nodejs_ref_guide", "-s", "-d", "-e", "markdown", "-g", "javascript", "-f", "ast", "-p", "./parseOptions.json", "-a", "./additionalObjs.json", "-o", "./nodemanual.input"], function(err) {
    if (err) {
        console.error(err);
        process.exit(-1);
    }
});