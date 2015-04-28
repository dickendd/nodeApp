angular.module('truckApp').controller('ProfileCtrl', ['$rootScope', '$scope', '$location', 'AuthService', function($rootScope, $scope, $location, AuthService) {

    AuthService.me(function(res) {
        $scope.myDetails = res;
    }, function() {
        $rootScope.error = 'Failed to fetch details';
    })
}]);