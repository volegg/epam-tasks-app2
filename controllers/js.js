var fs = require('fs'),
    config = require('../config');

exports.getAction = function(request, response, pathname, postData, filename) {
    response.writeHead(200, {"Content-Type": 'text/javascript'});
    fs.createReadStream(config.directories.templates + '/js/' + filename + '.js').pipe(response);
};
