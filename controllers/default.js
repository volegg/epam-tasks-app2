var fs = require('fs'),
    config = require('../config');

exports.getAction = function(request, response, pathname) {
    response.writeHead(200, {"Content-Type": 'text/javascript'});

    console.log(pathname);
    var pathFile = config.directories.project + pathname;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            fs.createReadStream(config.directories.project + pathname).pipe(response);
        }
    });
};
