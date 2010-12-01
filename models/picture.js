var	mongoose = require('mongoose').Mongoose,
	db       = mongoose.connect('mongodb://127.0.0.1/decembeard');
 
mongoose.model('Picture', {
  properties: ['num','photo_data','username','created_on'],	

  methods: {
        save: function(fn){
			if (this.isNew){
				this.created_on = new Date();
				this.num = this.created_on.getTime().toString();
			}
            
            this.__super__(fn);
        }
    }
});
 
module.exports = db.model('Picture');