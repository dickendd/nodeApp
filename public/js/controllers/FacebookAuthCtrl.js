angular.module('truckApp').controller('FacebookAuthCtrl', function($scope, Facebook) {

    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
        // Do something with response.
        if(response.status === 'connected'){
          $scope.getLoginStatus();
        }
      }, {scope: 'manage_pages,publish_actions'});
    };

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          console.log(response);
          $scope.me();
          $scope.loggedIn = true;
          $scope.currentUser.fbToken = response.authResponse.accessToken;
        } else {
          $scope.loggedIn = false;
        }
      });
    };

    $scope.me = function() {
      Facebook.api('/me', function(response) {
        console.log(response);
        $scope.userName = response.name;
        $scope.fblink = response.link;
      });
    };

    $scope.$watch(function() {
      // This is for convenience, to notify if Facebook is loaded and ready to go.
      return Facebook.isReady();
    }, function(newVal) {
      // You might want to use this to disable/show/hide buttons and else
      $scope.getLoginStatus();
    });

  });