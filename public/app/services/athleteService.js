angular.module('athleteService', [])

.factory('Athlete', function($http) {

	// create a new object
	var athleteFactory = {};

	// get a single athlete
	athleteFactory.get = function(id) {
		return $http.get('/api/athletes/' + id);
	};

	// get all athlete
	athleteFactory.all = function() {
		return $http.get('/api/athletes/');
	};

	// create a athlete
	athleteFactory.create = function(athleteData) {
		return $http.post('/api/athletes/', athleteData);
	};

	// update a athlete
	athleteFactory.update = function(id, athleteData) {
		return $http.put('/api/athletes/' + id, athleteData);
	};

	// delete a athlete
	athleteFactory.delete = function(id) {
		return $http.delete('/api/athletes/' + id);
	};

	// return our entire athleteFactory object
	return athleteFactory;

});