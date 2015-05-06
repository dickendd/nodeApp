angular.module('truckApp')
    .controller('AdminUserCtrl', 
    	['$rootScope',
        '$scope',
    	'$location', 
        '$window', 
    	'AuthService', 
        'AUTH_EVENTS', 
        'Session', 
    	function($rootScope, $scope, $location, $window, AuthService, AUTH_EVENTS, Session) {
            $scope.credentials = {
                username: '',
                password: ''
            };

    		$scope.login = function() {
                var formData = {
                    email: $scope.email,
                    password: $scope.password
                }

                AuthService.login(formData).then(function(res) {
                    if (res.data.type == false) {
                        $scope.throwErrors(res.data.data);
                    } else {
                        $scope.throwErrors(null);
                        $scope.setCurrentUser(res.data.data);
                        $window.sessionStorage.token = res.data.token;
                        $scope.setLoggedIn(true);
                        $location.path('/trucks');
                    }
                }, function() {
                    $scope.throwErrors(AUTH_EVENTS.loginFailed);
                })
            };

            $scope.signup = function() {
                var formData = {
                    email: $scope.email,
                    password: $scope.password,
                    role: 'USER'
                }

                AuthService.save(formData, function(res) {
                    if (res.type == false) {
                        alert(res.data)
                    } else {
                        $window.sessionStorage.token = res.data.token;
                        window.location = "/"   
                    }
                }, function() {
                    $rootScope.error = 'Failed to sign up';
                })
            };
     
            $scope.me = function() {
                AuthService.me(function(res) {
                    $scope.myDetails = res;
                }, function() {
                    $rootScope.error = 'Failed to fetch details';
                })
            };
     
            $scope.logout = function() {
                Session.destroy();
                $window.sessionStorage.clear();
                $scope.setCurrentUser(null);
                $scope.setLoggedIn(false);
                $location.path('/');
            };

            $scope.token = $window.sessionStorage.token;
    	}
    ]);