// public/js/services/TruckService.js
angular.module('truckApp').factory('UserLocationService', ['$http', function($http) {

    return {
        // call to get all user locations
        get : function() {
            return $http.get('/api/locs');
        },
        // call to POST and create a new user location
        create : function(locData) {
            return $http.post('/api/locs', locData);
        }
    }

}]);
