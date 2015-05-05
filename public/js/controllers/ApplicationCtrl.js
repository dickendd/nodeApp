angular.module('truckApp').controller('ApplicationCtrl', function ($scope, USER_ROLES, AuthService) {
	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.errors = null;
	$scope.loggedIn = false;

	$scope.$on('logError', function (data) {
		console.log(data);
		$scope.errors = data;
	});

	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};

	$scope.throwErrors = function(errors) {
		$scope.errors = errors;
	};

	$scope.setLoggedIn = function(loggedIn) {
		$scope.loggedIn = loggedIn;
	};
});