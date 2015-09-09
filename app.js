var http = require('http'),
    url = require('url'),
    path = require('path'),
    router = require('./router');

http.createServer(function(request, response) {
    var postData = '', pathname, ext, filename;

    request.setEncoding('utf8');
    pathname = url.parse(request.url).pathname.trim().toLowerCase();
    ext = path.extname(pathname).split('.').join("");

    if (pathname.lastIndexOf('/') === pathname.length - 1) {
        pathname = pathname.substring(0, pathname.length - 1);
    } else if (ext === 'css' || ext === 'js') {
      var regExp = /(\/)(\w+)(\.js)/gi;

      filename = pathname.match(regExp);
      if (filename !== null) filename = filename[0].replace(/(\/)|(\.js)/gi,'');

      pathname = '/' + ext;
    }

    console.log('Requested: ' + pathname + ', filename: ' +filename);

    request.addListener('data', function(chunk) {
        postData += chunk;
    });

    request.addListener('end', function() {
        router.match(request, response, pathname, postData, filename);
    });

}).listen(8888);
