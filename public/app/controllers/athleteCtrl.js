angular.module('athleteCtrl', ['athleteService'])

.controller('athleteController', function(Athlete) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the athletes at page load
	Athlete.all()
		.success(function(data) {

			// when all the athletes come back, remove the processing variable
			vm.processing = false;

			// bind the athletes that come back to vm.athletes
			vm.athletes = data;
		});

	// function to delete a athlete
	vm.deleteAthlete = function(id) {
		vm.processing = true;

		Athlete.delete(id)
			.success(function(data) {

				// get all athletes to update the table
				// you can also set up your api 
				// to return the list of athletes with the delete call
				Athlete.all()
					.success(function(data) {
						vm.processing = false;
						vm.athletes = data;
					});

			});
	};

})

// controller applied to athlete creation page
.controller('athleteCreateController', function(Athlete) {
	
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a athlete
	vm.saveAthlete = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the athleteService
		Athlete.create(vm.athleteData)
			.success(function(data) {
				vm.processing = false;
				vm.athleteData = {};
				vm.message = data.message;
			});	
	};	

})

// controller applied to athlete edit page
.controller('athleteEditController', function($routeParams, Athlete) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the athlete data for the athlete you want to edit
	// $routeParams is the way we grab data from the URL
	Athlete.get($routeParams.athlete_id)
		.success(function(data) {
			vm.athleteData = data;
		});

	// function to save the athlete
	vm.saveAthlete = function() {
		vm.processing = true;
		vm.message = '';

		// call the athleteService function to update 
		Athlete.update($routeParams.athlete_id, vm.athleteData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.athleteData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});