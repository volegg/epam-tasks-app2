var fs = require('fs'),
    config = require('../config');

exports.getAction = function(request, response) {
    response.writeHead(200, {"Content-Type": 'text/html'});
    fs.createReadStream(config.directories.project + '/index.html').pipe(response);
};
