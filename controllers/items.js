var fs = require('fs'),
    qs = require('querystring'),
    config = require('../config');

exports.getAction = function (request, response) {
    fs.exists(config.database.path, function (isExists) {
        response.writeHead(200, {'Content-Type': 'application/json'});

        if (false === isExists) {
            response.end(JSON.stringify([]));

        } else {
            fs.createReadStream(config.database.path).pipe(response);
        }
    });
};

exports.postAction = function (request, response, pathname, postData) {
    if(typeof postData === "String") {
        postData = qs.parse(postData);
    }

    postData = JSON.parse(postData);

    fs.readFile(config.database.path, function (err, data) {
        data = err || !data ? [] : JSON.parse(data.toString('utf8'));
        postData.id = new Date().toISOString().replace(/[^\d]/g, '');
        postData.phone = parseInt(postData.phone, 10);
        data.push(postData);

        fs.writeFile(config.database.path, JSON.stringify(data), function (err) {
            if (err) {
                console.log(err);
                response.writeHead(503, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({error: 'Can\'t save data. Please see server\'s console output for details.'}));

            } else {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(postData));
            }
        });
    });
};

exports.deleteAllAction = function (request, response, pathname) {
    var deleteData = qs.parse(request.url.trim().replace(/.*\?/, ''));
    var deleteId = [];

    deleteData.id && (deleteId = deleteData.id.split(','));

    if (deleteId.length) {
        fs.readFile(config.database.path, function (err, data) {
            var deletedItems = [];

            data = err || !data ? [] : JSON.parse(data.toString('utf8'));
            data = data.filter(function (item) {
                var c = deleteId.indexOf(item.id) < 0;

                !c && (deletedItems.push(item));

                return c;
            });

            fs.writeFile(config.database.path, JSON.stringify(data), function (err) {
                if (err) {
                    console.log(err);
                    response.writeHead(503, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({error: 'Can\'t save data. Please see server\'s console output for details.'}));

                } else {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(deletedItems));
                }
            });
        });

    } else {
        fs.exists(config.database.path, function (isExists) {
            response.writeHead(204);
            response.end();

            if (false !== isExists) {
                fs.unlink(config.database.path);
            }
        });
    }

};
