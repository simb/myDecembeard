var	mongoose = require('mongoose').Mongoose,
	db       = mongoose.connect('mongodb://127.0.0.1/decembeard');
 
mongoose.model('Picture', {
  properties: ['num','photo_data','username']
});
 
module.exports = db.model('Picture');