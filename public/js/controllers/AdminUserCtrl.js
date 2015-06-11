angular.module('truckApp')
    .constant('FB0', 'Login to Facebook and connect with your WFF account if you wish to post to your wall.')
    .constant('FB1', 'Please log back into Facebook.')
    .constant('FB2', 'Connect your Facebook account if you wish to post to your wall.')
    .constant('FB3', 'Please log out and back in with correct account')
    .constant('FB4', 'Thanks for connecting your Facebook account')
    .controller('AdminUserCtrl', 
    	['$rootScope',
        '$scope',
    	'$location', 
        '$window', 
        '$q', 
    	'AuthService', 
        'AUTH_EVENTS', 
        'Session', 
        'Facebook',
        'FB0',
        'FB1',
        'FB2',
        'FB3',
        'FB4',
    	function($rootScope, $scope, $location, $window, $q, AuthService, AUTH_EVENTS, Session, Facebook, FB0, FB1, FB2, FB3, FB4) {
            $scope.credentials = {
                username: '',
                password: ''
            };

            $rootScope.fbLogInStatus = 100;

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

                        if (res.data.data.fbToken) {
                            // User has connected facebook already, 
                            // so check if they're logged in
                            $scope.getLoginStatus()
                            .then(function(res) {
                                fbStatusText(res);
                            });
                        } else {
                            console.log('user has no facebook token');
                        }
                    }
                }, function() {
                    $scope.throwErrors(AUTH_EVENTS.loginFailed);
                })
            };

            $scope.getLoginStatus = function() {

                var deferred = $q.defer(),
                status = 99;

                if ($rootScope.currentUser != null && $rootScope.currentUser.email) {
                    Facebook.getLoginStatus(function(response) {
                        // console.log(response);
                        console.log($rootScope.currentUser);
                        if (response.status === 'connected') {
                            $scope.fbMe()
                            .then(function(fbUser) {
                                if (fbUser.email === $rootScope.currentUser.email) {
                                    status = 104;
                                    deferred.resolve(status);
                                } else if ($rootScope.currentUser.fbToken != null) {
                                    status = 103;
                                    deferred.resolve(status);
                                } else {
                                    status = 102;
                                    deferred.resolve(status);
                                }
                            });
                            $rootScope.currentUser.fbToken = response.authResponse.accessToken;
                            $rootScope.currentFbUser = response.authResponse;
                        } else if ($rootScope.currentUser.fbToken != null) {
                            status = 101;
                            deferred.resolve(status);
                        } else {
                            status = 100;
                            deferred.resolve(status);
                        }
                    });
                } else {
                    deferred.resolve(status);
                }

                return deferred.promise;
            };

            function fbStatusText(status) {
                console.log(status);
                switch (status) {
                    case 100:
                        $rootScope.fbStatusText = FB0;
                        break;
                    case 101:
                        $rootScope.fbStatusText = FB1;
                        break;
                    case 102:
                        $rootScope.fbStatusText = FB2;
                        break;
                    case 103:
                        $rootScope.fbStatusText = FB3;
                        break;
                    case 104:
                        $rootScope.fbStatusText = FB4;
                        break;
                    default:
                        $rootScope.fbStatusText = null;
                        break;
                }
                $rootScope.fbStatus = status;
            }





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
                    $rootScope.currentUser = res.data;
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

            $rootScope.addFbToken = function(data) {

                AuthService.update(data, function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        // return res;
                    }
                });
            };



            $rootScope.fbLogin = function() {
                // From now on you can use the Facebook service just as Facebook api says
                Facebook.login(function(response) {
                    // Do something with response.
                    if (response.status === 'connected') {
                        $scope.getLoginStatus()
                        .then(function(res){
                            fbStatusText(res);
                        });
                        var data = {
                            fbToken: response.authResponse.accessToken,
                            email: $rootScope.currentUser.email
                        };
                        $rootScope.addFbToken(data, function(res) {
                            console.log(res);
                        });
                    }
                }, {scope: 'manage_pages,publish_actions,email'});
            };

            $rootScope.fbLogOut = function() {
                Facebook.logout(function(response) {
                    $rootScope.fbLoggedInAndConnected = false;
                    $rootScope.fbUser = {};
                    $rootScope.fbLoggedIn = false;
                    $rootScope.emailsDontMatch = false;
                    $rootScope.fbLoginMessage = null;

                    $scope.getLoginStatus()
                    .then(function(res){
                        fbStatusText(res);
                    });
                });
            }

            

            $scope.fbMe = function() {
                var deferred = $q.defer();
                Facebook.api('/me', function(response) {
                    $rootScope.userName = response.name;
                    $rootScope.fblink = response.link;
                    $rootScope.fbEmail = response.email;
                    deferred.resolve(response);
                });
                return deferred.promise;
            };

            $rootScope.fbPost = function(data) {
                var messageText = data.text + ' at ' + data.address + '. ' + data.link;
                Facebook.api('/me/feed', 'post', {message: messageText});
            }

            $scope.$watch(function() {
                return Facebook.isReady();
            }, function(newVal) {
                if ($location.path === '/trucks') {
                    $scope.me();
                    $scope.getLoginStatus()
                    .then(function(res){
                        fbStatusText(res);
                    });
                }
            });

            $scope.token = $window.sessionStorage.token;
    	}
    ]);