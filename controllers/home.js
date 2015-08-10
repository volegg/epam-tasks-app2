exports.getAction = function(request, response) {
    response.writeHead(200, {"Content-Type": 'text/html'});
    response.end('<a href="/form">Go to form</a>');
};
