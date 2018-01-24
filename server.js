var express = require("express");
var app     = express();
var path    = require("path");
var fs = require('fs');
var key = fs.readFileSync('encryption/fireplace.key');
var cert = fs.readFileSync( 'encryption/fireplace.crt' );
var multer = require('multer'); 
var serveIndex = require('serve-index');

var options = {
    key: key,
    cert: cert,
};

var https = require('https');
https.createServer(options, app).listen(8888);

var options = {
    index: "index.html"
};

var upload = multer().single();

app.use('/',express.static(path.join(__dirname,'static'), options)).
    use('/images', express.static(path.join(__dirname,'static/images')), serveIndex(path.join(__dirname,'static/images'), {'icons':true}));

app.post('/snap-register', function(req, res, next) {
    upload(req, res, function (err) {
        if (err) { 
	    console.log(err);
            return res.end("Something went wrong!"); 
        } 
        var base64Data=req.body.image;
//	console.log('writing file...', req.body.image);
        fs.writeFile(__dirname + "/static/images/" + req.body.username + ".png", base64Data, 'base64');
        return res.end("File uploaded sucessfully!."); 
    }); 
});

app.use(function(req, res, next) {
        if (req.secure) {
	    next();
	 } else {
		res.redirect('https://' + req.headers.host + req.url + ':8888');
         }
      });

console.log('Fireplace app listening on port 8888!');

