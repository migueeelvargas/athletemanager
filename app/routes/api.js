var bodyParser = require('body-parser');
var User       = require('../models/user');
var Athlete 	 = require('../models/athlete');
var School 		 = require('../models/school');
var Account 	 = require('../models/account');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresIn: '24h' // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// // route middleware to verify a token
	// apiRouter.use(function(req, res, next) {
	// 	// do logging
	// 	console.log('Somebody just came to our app!');

	//   // check header or url parameters or post parameters for token
	//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

	//   // decode token
	//   if (token) {

	//     // verifies secret and checks exp
	//     jwt.verify(token, superSecret, function(err, decoded) {      

	//       if (err) {
	//         res.status(403).send({ 
	//         	success: false, 
	//         	message: 'Failed to authenticate token.' 
	//     	});  	   
	//       } else { 
	//         // if everything is good, save to request for use in other routes
	//         req.decoded = decoded;
	            
	//         next(); // make sure we go to the next routes and don't stop here
	//       }
	//     });

	//   } else {

	//     // if there is no token
	//     // return an HTTP response of 403 (access forbidden) and an error message
 //   	 	res.status(403).send({ 
 //   	 		success: false, 
 //   	 		message: 'No token provided.' 
 //   	 	});
	    
	//   }
	// });

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// on routes that end in /accounts/
	// ----------------------------------------------------
	apiRouter.route('/accounts')

		// create an account
		.post(function(req, res) {

			var account = new Account();
			account.name.first = req.body.first;
			account.name.last = req.body.last;
			account.username = req.body.username;
			account.password = req.body.password;
			account.type = req.body.type;

			account.save(function(err) {
				if (err) {
					// if there's a duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'An account with that username already exists.'});
					else
						return res.send(err);
				}

				// return a successful message
				res.json({ message: 'Account created!' });
			});
		}) 

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});


// on routes that end in /athletes
apiRouter.route('/athletes')

	// create an athlete (POST)
	.post(function(req, res) {

		// create new instance of athlete model
		var athlete = new Athlete();
		athlete.name.first = req.body.first;
		athlete.name.last = req.body.last;
		athlete._id = req.body.id;
		athlete.grade = req.body.grade;
		athlete.school = req.body.school;

		athlete.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, message: 'This student already exists.'});
				else
					return res.send(err);
			}

			// return a message
			res.json({ message: 'Athlete succesfully added!'});
		});

	})

	// get all the athletes (acessed by GET)
	.get(function(req, res) {

		Athlete.find({}, function(err, athletes) {

			if (err)
				res.send(err);

			// return the athletes
			res.json(athletes);

		});
	});

// on routes that end in athletes/:athlete_id
apiRouter.route('/athletes/:athlete_id')

	// get the athlete with matching id
	.get(function(req, res) {
		Athlete.findById(req.params.athlete_id, function(err, athlete) {
			if (err)
				res.send(err)

			// return the athlete
			res.json(athlete);
		});
	})

	// update the athlete with this id
	.put(function(req, res) {
		Athlete.findById(req.params.athlete_id, function(err, athlete) {

			if (err)
				res.send(err);

			// set the new athlete information if it exists in the request
			if (req.body.first)
				athlete.name.first = req.body.first;
			if (req.body.last)
				athlete.name.last = req.body.last;
			if (req.body.grade)
				athlete.grade = req.body.grade;
			if (req.body.school)
				athlete.school = req.body.school;
			if (req.body.id)
				athlete._id = req.body.id;

			// save the athlete
			athlete.save(function(err) {
				if (err)
					res.send(err);

				// return a message
				res.json({ message: 'Athlete updated!'});
			});

		});
	})

	// delete the athlete with this id
	.delete(function(req, res) {
		Athlete.remove({
			_id: req.params.athlete_id
		}, function(err, athlete) {
			if (err)
				res.send(err);

			res.json({ message: 'Succesfully deleted' });
		});
	});

// // on routes that end in /schools
// apiRouter.route('/schools')

// 	// create a School (POST)
// 	.post(function(req, res) {

// 		// create new instance of school model
// 		var school = new School();
// 		school.name = req.body.name;
// 		school.address = req.body.address;
// 		school.city = req.body.city;
// 		school.state = req.body.state;
// 		school.zipcode = req.body.zipcode;
// 		school.phone = req.body.phone;

// 		school.save(function(err) {
// 			if (err) {
// 				// duplicate entry
// 				if (err.code == 11000)
// 					return res.json({ success: false, message: 'This school already exists.'});
// 				else
// 					return res.send(err);
// 			}

// 			// return a message
// 			res.json({ message: 'School succesfully added!'});
// 		})

// 	// get all the schools (accessed at GET /api/schools)
// 	.get(function(req, res) {

// 		School.find({}, function(err, schools) {
// 			if (err) res.send(err);

// 			// return the users
// 			res.json(schools);
// 		});
// 	});

// });

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};