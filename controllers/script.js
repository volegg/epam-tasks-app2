var fs = require('fs'),
    config = require('../config');

exports.getAction = function(request, response) {
    response.writeHead(200, {"Content-Type": 'text/javascript'});
    fs.createReadStream(config.directories.templates + '/script/script.js').pipe(response);
};