var http = require('http'),
    url = require('url'),
    router = require('./router');

http.createServer(function(request, response) {
    var postData = '', pathname;

    request.setEncoding('utf8');
    pathname = url.parse(request.url).pathname.trim().toLowerCase();
   
    if (pathname.lastIndexOf('/') === pathname.length - 1) {
        pathname = pathname.substring(0, pathname.length - 1);
    };

    console.log('Requested: ' + pathname);

    request.addListener('data', function(chunk) {
        postData += chunk;
    });

    request.addListener('end', function() {
        router.match(request, response, pathname, postData);
    });

}).listen(8888);
