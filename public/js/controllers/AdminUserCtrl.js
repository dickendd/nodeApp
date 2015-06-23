angular.module('truckApp')
    .constant('FB0', 'Login to Facebook and connect with your WFF account if you wish to post to your wall.')
    .constant('FB1', 'Please log back into Facebook.')
    .constant('FB2', 'Connect your Facebook account if you wish to post to your wall.')
    .constant('FB3', 'We don\'t recognize this account. Please log out and back in with correct Facebook account')
    .constant('FB4', '')
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
            $rootScope.fbIsReady = false;
            $rootScope.fbShowDetails = false;
            $rootScope.postStatus = {
                status : null,
                message : ''
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
                        $location.path('/trucks');
                        $scope.throwErrors(null);
                        $scope.setCurrentUser(res.data.data);
                        $window.sessionStorage.token = res.data.token;
                        $scope.setLoggedIn(true);

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
                        if (response.status === 'connected') {
                            $scope.fbMe()
                            .then(function(fbUser) {
                                if (fbUser.email === $rootScope.currentUser.email) {
                                    status = 104;
                                    deferred.resolve(status);
                                    getUserImage(fbUser.id);
                                    getUserPages(fbUser.id);
                                } else if ($rootScope.currentUser.fbToken != null) {
                                    status = 103;
                                    deferred.resolve(status);
                                } else {
                                    status = 102;
                                    deferred.resolve(status);
                                }
                            });
                            $rootScope.currentUser.fbToken = response.authResponse.accessToken;
                            $rootScope.selectedPage = $rootScope.currentUser.fbPage;
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

            function getUserImage(id) {
                Facebook.api(
                    '/' + id + '/picture',
                    function (response) {
                      if (response && !response.error) {
                        /* handle the result */
                        $rootScope.currentUser.fbImage = response.data.url;
                      }
                    }
                );
            }

            function getUserPages(id) {
                Facebook.api('/' + id + '/accounts', function(res){
                    $rootScope.fbPages = res.data;
                });
            };

            function fbStatusText(status) {
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
                $rootScope.fbLogInStatus = status;
                $scope.setFbStatus(status);
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
                        window.location = '/'   
                    }
                }, function() {
                    $rootScope.error = 'Failed to sign up';
                })
            };
     
            $scope.me = function() {
                var deferred = $q.defer();
                AuthService.me(function(res) {
                    $scope.setCurrentUser(res.data);
                    deferred.resolve(res);
                }, function() {
                    $rootScope.error = 'Failed to fetch details';
                    deferred.reject('Failed to fetch details');
                });

                return deferred.promise;
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
                        return res;
                    }
                });

                if (data.fbToken == '') {
                    $rootScope.fbStatusText = '';
                    $rootScope.userName = '';
                    $rootScope.currentUser.fbImage = '';
                    $rootScope.currentUser.fbToken = '';
                    $rootScope.fbLogInStatus = 100;
                }
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
                        $rootScope.addFbToken(data);
                    }
                }, {scope: 'manage_pages,email,publish_pages'});
            };

            $rootScope.fbLogOut = function() {
                Facebook.logout(function(response) {
                    $rootScope.fbUser = {};
                    $rootScope.fbLoggedIn = false;
                    $rootScope.fbLoginMessage = null;
                    $rootScope.fbLogInStatus = 100;

                    $scope.getLoginStatus()
                    .then(function(res){
                        fbStatusText(res);
                    });
                });
            };

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

            $rootScope.fbPagePost = function(page, data) {
                $rootScope.postStatus = {
                    status : null,
                    message : ''
                };
                if (page.id) {
                    for(var i = 0; i < $rootScope.fbPages.length; i++){
                        if($rootScope.fbPages[i].id === page.id){
                            var accessToken = $rootScope.fbPages[i].access_token;
                        }
                    }
                    var messageText = data.text + ' at ' + data.address + '. ' + data.link;
                    Facebook.api('/' + page.id + '/feed?access_token=' + accessToken, 'post', {message: messageText}, function(res){
                        console.log(res);
                        if(res.id){
                            // alert('Post successful!');
                            $rootScope.postStatus = {
                                status : null,
                                message : 'Post successful!'
                            }
                        } else if(res.error) {
                            // alert(res.error.error_user_msg);
                            $rootScope.postStatus = {
                                status : 'error',
                                message : res.error.error_user_msg
                            }
                        }
                    });
                } else {
                    alert('Whoa there! Please select a page to post as!');
                }
            };

            $scope.$watch(function() {
                return Facebook.isReady();
            }, function() {
                $rootScope.fbIsReady = true;
                if ($location.path() === '/trucks') {
                    $scope.me()
                    .then(function(){
                        $scope.getLoginStatus()
                        .then(function(res){
                            $rootScope.selectedPage = $rootScope.currentUser.fbPage;
                            fbStatusText(res);
                        });
                    });
                }
            });

            $rootScope.fbRevoke = function(){
                if (confirm('Are you sure you want to remove your Facebook page?')) {
                    Facebook.api('/me/permissions', 'delete', function(response) {
                        if (response.success) {
                            var data = {
                                fbToken: '',
                                email: $rootScope.currentUser.email,
                                fbPage: ''
                            };
                            $rootScope.addFbToken(data);
                            $scope.showFbDetails();
                            $scope.setFbStatus(100);
                        }
                    });
                }
            };

            $rootScope.setPage = function(page) {
                // console.log(page.id);
                data = {
                    email: $rootScope.currentUser.email,
                    fbPage: page,
                    fbToken: $rootScope.currentUser.fbToken
                };
                AuthService.update(data, function(res) {
                    if (res.type == false) {
                        // console.log(res);
                    } else {
                        // console.log(res);
                    }
                });
            };

            $scope.token = $window.sessionStorage.token;
    	}
    ]);