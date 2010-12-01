//Hi There. Not sure why you can see this but I suppose its ok.
//Lets setup the modules that we will need for this app
var sys = require('sys'),
	express = require('express'),
	MemoryStore = require('connect/middleware/session/memory'),
	auth = require('./lib/index'),
	OAuth = require('oauth').OAuth,
	formidable = require('formidable'),
	fs = require('fs'),
	ObjectID = require('mongodb/bson/bson').ObjectID,
	mongoose = require('mongoose').Mongoose,
	db       = mongoose.connect('mongodb://127.0.0.1/decembeard'),
	Picture  = require('./models/picture');
	twitterConsumerKey = "k0HHkKlwFe72tzMLbf9tw",
	twitterConsumerSecret = "LaGBpRfPPjc7ZHJBidzWHOIvmAS9MoauUkV2fZJr4g";

//We need to create the server and initialize the modules we are gonna use.
var server = express.createServer(
	express.cookieDecoder(),
	express.session({
	    store: new MemoryStore({
	        reapInterval: -1
	    })
	}),
	express.bodyDecoder(),
	auth([
		auth.Twitter({
	    	consumerKey: twitterConsumerKey,
	    	consumerSecret: twitterConsumerSecret
		})
	]),
	express.staticProvider(__dirname + '/public')
);
//set the directory for express to look in for our views
server.set('views', __dirname + '/views');

//Let setup the routes for our application.
server.get('/', function(req, res, params) {
    var self = this;
    if (!req.isAuthenticated()) {
        res.render('index.ejs');
    } else {
        res.render('home.ejs');
    }
})

server.get('/p/:username', function(req, res){
	Picture.find({username: req.params.username }).all(function(pics){
        res.render('profile.ejs', {
	        locals: {
	            username: req.params.username,
				pictures: pics,
				myProfile: (req.isAuthenticated() && req.params.username == req.getAuthDetails().user.username)
	        }
	    });
      });
	
});

server.get('/image/:objectID', function(req, res){
	Picture.find({num: req.params.objectID }).last(function(pic){
	//Picture.findById(req.params.objectID, function(pic){
		var buffer = new Buffer(pic.photo_data,'base64');
		res.writeHead(200, {'content-type': 'image/jpeg'});
		res.end(buffer);
	});
	
});

server.post('/upload', function(req, res){
	if (!req.isAuthenticated()) {
		res.render('noauth.ejs')
	}else{
		var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {
			
			fs.readFile(files.upload.path, function (err, buffer) {
			
				var photo_data = buffer;
				
		    	var p = new Picture({username: req.getAuthDetails().user.username, photo_data: photo_data.toString('base64')});
				
				p.save();
				//res.writeHead(200, {'content-type': 'image/jpeg'});
				//res.end(photo_data);
		  		res.writeHead(303, {
			        'Location': "/p/"+ req.getAuthDetails().user.username
			    });
			    res.end('');
				
			});
		
			
	    });
	}
});

server.get('/auth/twitter', function(req, res, params) {
    req.authenticate(['twitter'], function(error, authenticated) {
        if (authenticated) {
            var oa = new OAuth("http://twitter.com/oauth/request_token",
           		"http://twitter.com/oauth/access_token",
	        	twitterConsumerKey,
	        	twitterConsumerSecret,
	        	"1.0",
	        	null,
	        	"HMAC-SHA1");
            oa.getProtectedResource("http://twitter.com/statuses/user_timeline.xml", "GET",
            req.getAuthDetails()["twitter_oauth_token"], req.getAuthDetails()["twitter_oauth_token_secret"],
            function(error, data) {
                
				res.writeHead(303, {
			        'Location': "/p/"+ req.getAuthDetails().user.username
			    });
			    res.end('');
            });
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end("<html><h1>Twitter authentication failed :( </h1></html>")
        }
    });
})

server.get('/logout', function(req, res, params) {
    req.logout();
    res.writeHead(303, {
        'Location': "/"
    });
    res.end('');
})

server.get('/noauth', function(req, res, params) {
    res.render('noauth.ejs');
})

// Example 500 page
server.error(function(err, req, res){
    console.dir(err.message);
    res.render('500.ejs');
});

// Example 404 page via simple Connect middleware
server.use(function(req, res){
    res.render('404.ejs');
});

//dynamic helpers allow us to access request data inside views
server.dynamicHelpers({
    authenticated: function(req, res){
        return req.isAuthenticated();
    },
	user: function(req, res){
        return req.getAuthDetails().user;
    }
});
server.helpers({
    ObjectID: function(id){ 
		var oid = ObjectID(id.id);
		console.log(id);
		console.log(oid);
		return oid
	}
    
});


//Start the server on port 8124 and start processing requests
server.listen(8124);