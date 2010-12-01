var	mongoose = require('mongoose').Mongoose,
	db       = mongoose.connect('mongodb://localhost/connect');
 
mongoose.model('Counter', {
  properties: ['num']
});
 
module.exports = db.model('Counter');