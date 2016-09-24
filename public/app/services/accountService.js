angular.module('accountService', [])

.factory('Account', function($http) {

	// create a new object
	var accountFactory = {};

	// get a single account
	accountFactory.get = function(id) {
		return $http.get('/api/accounts/' + id);
	};

	// get all accounts
	accountFactory.all = function() {
		return $http.get('/api/accounts/');
	};

	// create an account
	accountFactory.create = function(accountData) {
		return $http.post('/api/accounts/', accountData);
	};

	// update an account
	accountFactory.update = function(id, accountData) {
		return $http.put('/api/accounts/' + id, accountData);
	};

	// delete an account
	accountFactory.delete = function(id) {
		return $http.delete('/api/accounts/' + id);
	};

	// return our entire accountFactory object
	return accountFactory;

});