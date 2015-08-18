var fs = require('fs'),
    config = require('../config');

exports.getAction = function(request, response) {
    response.writeHead(200, {"Content-Type": 'text/css'});
    fs.createReadStream(config.directories.templates + '/css/style.css').pipe(response);
};
