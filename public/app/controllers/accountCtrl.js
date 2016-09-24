angular.module('accountCtrl', ['accountService'])

.controller('accountController', function(Account) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the accounts at page load
	Account.all()
		.success(function(data) {

			// when all the Accounts come back, remove the processing variable
			vm.processing = false;

			// bind the Accounts that come back to vm.accounts
			vm.accounts = data;
		});

	// function to delete an Account
	vm.deleteAccount = function(id) {
		vm.processing = true;

		Account.delete(id)
			.success(function(data) {

				// get all Accounts to update the table
				// you can also set up your api 
				// to return the list of Accounts with the delete call
				Account.all()
					.success(function(data) {
						vm.processing = false;
						vm.accounts = data;
					});

			});
	};

})

// controller applied to user creation page
.controller('accountCreateController', function(Account) {
	
	var vm = this;

	vm.accountTypes = [
		{model : "Coach", type : "coach"},
		{model : "Athlete", type : "athlete"}
	];

	// function to create a user
	vm.saveAccount = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the accountService
		Account.create(vm.accountData)
			.success(function(data) {
				vm.processing = false;
				vm.accountData = {};
				vm.message = data.message;

				// if account is successfully created, redirect to dashboard
				if (data.success)			
					$location.path('/athletes');
				else 
					vm.error = data.message;
			});
			
	};

})

// controller used to handle the drop down menu on account create
.controller('dropdownController', function ($scope) {

	$scope.types = [
		'Coach',
		'Athlete'
	];
})

// controller applied to account edit page
.controller('accountEditController', function($routeParams, Account) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	Account.get($routeParams.account_id)
		.success(function(data) {
			vm.accountData = data;
		});

	// function to save the user
	vm.saveAccount = function() {
		vm.processing = true;
		vm.message = '';

		// call the accountService function to update 
		Account.update($routeParams.account_id, vm.accountData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.accountData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});