angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})
		
		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// show all athletes
		.when('/athletes', {
			templateUrl: 'app/views/pages/athletes/all.html',
			controller: 'athleteController',
			controllerAs: 'athlete'
		})

		// form to create a new athlete
		// same as edit page (for now)
		.when('/athletes/create', {
			templateUrl: 'app/views/pages/athletes/single.html',
			controller: 'athleteCreateController',
			controllerAs: 'athlete'
		})

		// page to edit an athlete
		.when('/athletes/:athlete_id', {
			templateUrl: 'app/views/pages/athletes/single.html',
			controller: 'athleteEditController',
			controllerAs: 'athlete'
		})

		// form to create a new account
		.when('/accounts/create', {
			templateUrl: 'app/views/pages/accounts/create.html',
			controller: 'accountCreateController',
			controllerAs: 'account'
		});

	$locationProvider.html5Mode(true);

});
