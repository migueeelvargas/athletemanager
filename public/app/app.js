angular.module('athleteManager', [
	'ngAnimate',
	'app.routes', 
	'authService',
	'athleteCtrl',
	'athleteService', 
	'mainCtrl', 
	'userCtrl', 
	'userService',
	'accountCtrl',
	'accountService'
	])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});