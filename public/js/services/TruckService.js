// public/js/services/TruckService.js
angular.module('truckApp').factory('TruckService', ['$http', function($http) {

    return {
        // call to get all trucks
        get : function() {
            return $http.get('/api/trucks');
        },

        getByUser : function(userId) {
            return $http.get('/api/trucks/user/' + userId);
        },

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new truck
        create : function(truckData) {
            return $http.post('/api/trucks', truckData);
        },

        update : function(id, truckData) {
            return $http.put('/api/trucks/' + id, truckData);
        },

        // call to DELETE a truck
        delete : function(id) {
            return $http.delete('/api/trucks/' + id);
        }
    }       

}]);

