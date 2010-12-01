var sys      = require('sys'),
    express  = require('express'),
    app      = express.createServer(),
 	mongoose = require('mongoose').Mongoose,
	db       = mongoose.connect('mongodb://localhost/connect'),
	Counter  = require('./models/counter');

 
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
  app.set('view engine', 'jade');
});
 
app.get('/', function(req, res) {
	
  Counter.count({},function(num_records) {
	
    if (num_records == 0) {
      var c = new Counter();
      c.num = 1;
      c.save(function(){
        res.render('index', {locals: {count: c.num}});
      });
    } else {
      Counter.find().last(function(c){
        c.num = c.num + 1;
        c.save(function(){
          res.render('index', {locals: {count: c.num}});
        });
      });
    }
  });
});

app.get('/echo', function(req, res) {
	res.send(sys.inspect(req.body));
});

app.get('/reset', function(req, res) {
	Counter.find().last(function(l){
		l.remove();
	});
	res.send('db reset');
});

app.listen(3000);
sys.puts("HTTP server is listening on port 3000");