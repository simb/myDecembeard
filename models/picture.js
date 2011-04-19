var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;


var Picture = new Schema({
	  num     		: String
	, photo_data	: String
	, username		: String
	, created_on	: { type: Date, default: Date.now }
});

Picture.pre('save', function (next) {
    if (this.isNew){
		this.num = this.created_on.getTime().toString();
	}
    next();
});

mongoose.model('Picture', Picture);
