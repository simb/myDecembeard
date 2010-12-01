//Hi There. Not sure why you can see this but I suppose its ok.
//Lets setup the modules that we will need for this app
var sys = require('sys'),
	express = require('express'),
	MemoryStore = require('connect/middleware/session/memory'),
	auth = require('./lib/index'),
	OAuth = require('oauth').OAuth,
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
        res.render('home.ejs', {
	        locals: {
	            user: req.getAuthDetails().user
	        }
	    });
    }
})
server.get('/p/:id', function(req, res){
    res.send('user ' + req.params.id);
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
			        'Location': "/"
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



//Start the server on port 8124 and start processing requests
server.listen(8124);