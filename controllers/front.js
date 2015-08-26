var fs = require('fs'),
    config = require('../config');

exports.getFile = function(request, response) {

    var contentType = 'text/html';
    if (!!request.url.match(/.*\.css$/)) {
        contentType = 'text/css';
    }
    else if (!!request.url.match(/.*\.js$/)) {
        contentType = 'application/javascript';
    }
    response.writeHead(200, {"Content-Type": contentType});
    fs.createReadStream(config.directories.project + request.url).pipe(response);
};
