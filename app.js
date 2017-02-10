/**
 * Copyright (C) 2017 yanni4night.com
 * app.js
 *
 * changelog
 * 2017-01-24[12:04:12]:revised
 * 2017-02-10[13:42:28]:/
 *
 * @author yanni4night@gmail.com
 * @version 0.1.2
 * @since 0.1.0
 */

var express = require('express');
var bodyParser = require('body-parser');
var yaml = require('js-yaml');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var doc;

try {
    doc = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));
} catch (e) {
    process.stderr.write('Load config.yml failed!');
    process.exit(-1);
}

app.all('/', function (req, res) {
    res.send('ready');
});

app.post(doc.route, function (req, res) {
    if (req.headers['x-gitlab-event'] === 'Push Hook') {
        var body = req.body;
        if (body.ref === 'refs/heads/master') {
            var name = body.project.name.toLowerCase();
            var url = body.project.http_url;
            var root = path.join(__dirname, doc.root);
            var ls = spawn('sh', ['deploy.sh', name, url, root], {
                cwd: __dirname
            });

            ls.stdout.on('data', function (data) {
                console.log(data.toString());
            });

            ls.stderr.on('data', function (data) {
                console.log(data.toString());
            });

            ls.on('close', function (code) {
                console.log('child process exited with code ' + code);
            });
        }
    }
    res.sendStatus(200);
});

app.listen(doc.port);