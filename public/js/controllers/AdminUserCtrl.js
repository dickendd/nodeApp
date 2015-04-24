angular.module('bearApp')
    .controller('AdminUserCtrl', 
    	['$rootScope',
        '$scope',
    	'$location', 
        '$localStorage', 
    	'AuthService',
    	function($rootScope, $scope, $location, $localStorage, AuthService) {
    		$scope.login = function() {
                var formData = {
                    email: $scope.email,
                    password: $scope.password
                }

                AuthService.login(formData, function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        $localStorage.token = res.data.token;
                        window.location = '/me';
                    }
                }, function() {
                    $rootScope.error = 'Failed to log in';
                })
            };

            $scope.signup = function() {
                var formData = {
                    email: $scope.email,
                    password: $scope.password
                }

                AuthService.save(formData, function(res) {
                    if (res.type == false) {
                        alert(res.data)
                    } else {
                        $localStorage.token = res.data.token;
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
                AuthService.logout(function() {
                    window.location = "/"
                }, function() {
                    alert("Failed to log out!");
                });
            };
            $scope.token = $localStorage.token;
    	}
    ]);