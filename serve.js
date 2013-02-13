#!/usr/bin/env node

var http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs');

var contentTypes = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html'
}
 
http.createServer(function (request, response) {
 
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri),
        extname = path.extname(filename),
        contentType = contentTypes[extname] || 'text/plain';
     
    fs.exists(filename, function(exists) {
     
        if (exists) {
            fs.readFile(filename, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    var stream = fs.createReadStream(filename);
                    stream.pipe(response);
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(8125);
 
console.log('Server running at http://127.0.0.1:8125/');
