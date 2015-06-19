angular.module('truckApp').controller('ApplicationCtrl', function ($rootScope, $scope, USER_ROLES, AuthService) {
	$rootScope.currentUser = AuthService.getCurrentUser() || null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$rootScope.errors = null;
	$scope.loggedIn = false;
	$scope.fbShowDetails = false;
	$scope.fbLoginStatus = 100;

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

	$scope.setFbStatus = function(fbStatus) {
		$scope.fbLoginStatus = fbStatus;
	};

	$scope.showFbDetails = function() {
		if ($scope.fbShowDetails) {
			$scope.fbShowDetails = false;
		} else {
			$scope.fbShowDetails = true;
		}
	};

	// Check if there is a currentUser to set loggedIn variable
	if ($rootScope.currentUser._id) {
		$scope.setLoggedIn(true);
	}
});