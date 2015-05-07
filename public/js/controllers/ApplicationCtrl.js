angular.module('truckApp').controller('ApplicationCtrl', function ($rootScope, $scope, USER_ROLES, AuthService) {
	$rootScope.currentUser = AuthService.getCurrentUser() || null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$rootScope.errors = null;
	$scope.loggedIn = false;

	$scope.$on('logError', function (data) {
		$scope.errors = data;
	});

	$scope.setCurrentUser = function (user) {
		$rootScope.currentUser = user;
	};

	$scope.throwErrors = function(errors) {
		$rootScope.errors = errors;
	};

	$scope.setLoggedIn = function(loggedIn) {
		$scope.loggedIn = loggedIn;
	};

	// Check if there is a currentUser to set loggedIn variable
	if ($rootScope.currentUser._id) {
		console.log('currentuser');
		$scope.setLoggedIn(true);
	}
});