// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var AthleteSchema = new Schema({
	_id: {
		type: String,
	}, 
	name: {
		first: String,
		last: String,
	},
	grade: {
		type: String,
		required: true
	},
	school: {
		type: String,
		required: true
	},
	email: String
});

// return the model
module.exports = mongoose.model('Athlete', AthleteSchema);