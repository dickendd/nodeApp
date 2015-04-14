// public/js/services/BearService.js
angular.module('bearApp').factory('BearService', ['$http', function($http) {

    return {
        // call to get all bears
        get : function() {
            return $http.get('/api/bears');
        },

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new bear
        create : function(bearData) {
            return $http.post('/api/bears', bearData);
        },

        update : function(id, bearData) {
            return $http.put('/api/bears/' + id, bearData);
        },

        // call to DELETE a bear
        delete : function(id) {
            return $http.delete('/api/bears/' + id);
        }
    }       

}]);

