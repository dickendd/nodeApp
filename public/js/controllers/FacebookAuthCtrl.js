angular.module('truckApp').controller('FacebookAuthCtrl', function($scope, Facebook) {

    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
        // Do something with response.
        if(response.status === 'connected'){
          console.log(response);
          $scope.me();
          $scope.fbloggedin = true;
        }
      }, {scope: 'manage_pages'});
    };

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          console.log(response);
          $scope.loggedIn = true;
          $scope.me();
        } else {
          $scope.loggedIn = false;
        }
      });
    };

    $scope.me = function() {
      Facebook.api('/me', function(response) {
        console.log(response);
        $scope.user = response;
        $scope.userName = $scope.user.name;
        $scope.fblink = $scope.user.link;
      });
    };

    $scope.getLoginStatus();
  });