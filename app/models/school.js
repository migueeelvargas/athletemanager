var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// school schema 
var SchoolSchema   = new Schema({
	name: String,
	address: String,
	city: String,
	state: String,
	zipcode: String,
	phone: String
});


module.exports = mongoose.model('School', SchoolSchema);