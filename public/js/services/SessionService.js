angular.module('truckApp').service('Session', function ($window) {
  this.create = function (sessionId, userId, userRole) {
    $window.sessionStorage.id = sessionId;
    $window.sessionStorage.userId = userId;
    $window.sessionStorage.userRole = userRole;
  };
  this.destroy = function () {
    $window.sessionStorage.id = null;
    $window.sessionStorage.userId = null;
    $window.sessionStorage.userRole = null;
  };
})