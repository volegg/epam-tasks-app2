var config = require('./config');

exports.match = function(request, response, pathname, postData) {
    var isRouteExists = config.getRoutes().some(function(route) {
        if (-1 !== route.methods.indexOf(request.method) && -1 !== pathname.search('^' + route.pattern + '$')) {
            var controller = route.action.split('::')[0],
                action = route.action.split('::')[1];

            config.getController(controller)[action](request, response, pathname, postData);
            return true;
        }
    });

    if (!isRouteExists) {
        if (pathname.length > 0) {
            config.getController('file').getAction(request, response, pathname);
        } else {
            config.getController('home').getAction(request, response);
        }
    }
};
