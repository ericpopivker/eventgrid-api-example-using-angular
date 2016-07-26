var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var apiKey = require('./apiKey').value;

console.log(apiKey);

var app = express();

app.use(bodyParser.json());

var dev = process.argv[2] == 'dev',
    indexPath = dev ?  '/app/index.html' : '/dist/index.html';

if(dev){
    app.use(express.static('app'));
    app.use('/bower_components', express.static('bower_components'));
}
else{
    app.use(express.static('dist'));
}

app.all('/api/*', function(req, res) {
    var url = 'https://api.stable.eventgrid.com' + req.url.replace('/api', '/2.0/customer-api');

    if(req.method == 'GET'){
        url += (/\?/.test(url) ? '&' : '?') + 'apiKey=' + apiKey;
        req.pipe(request(url)).pipe(res);
    }
    if(req.method == 'POST'){
        req.body.apiKey = apiKey;
        request.post({
            headers: {
                'content-type' : 'application/json'
            },
            url: url,
            body: JSON.stringify(req.body)
        }).pipe(res);
    }
});

app.get('/Events/*',function(req,res){
    res.sendFile(__dirname  + indexPath);
});

app.get('/*/Order/*',function(req,res){
    res.sendFile(__dirname  + indexPath);
});

app.listen(3333, function(){
    console.log('server started: http://localhost:3333');
});