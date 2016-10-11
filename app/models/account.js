var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// account schema 
var AccountSchema   = new Schema({
	name: {
		first: String,
		last: String,
	},
	username: { 
		type: String, 
		required: true, 
		index: { unique: true }
	},	
	password: { 
		type: String, 
		required: true, 
		select: false 
	},
	type: {
		type: String,
		required: true
	}
});

// hash the password before the account is saved
AccountSchema.pre('save', function(next) {
	var account = this;

	// hash the password only if the password has been changed or account is new
	if (!account.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(account.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		account.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
AccountSchema.methods.comparePassword = function(password) {
	var account = this;

	return bcrypt.compareSync(password, account.password);
};

module.exports = mongoose.model('Account', AccountSchema);