angular.module('truckApp')
    .factory('LocationService', function($q) {
        
        var latLong = null;
        
        var getLatLong = function(refresh) {
            console.log('getting lat lng');
            var deferred = $q.defer();
            
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log('got it!');
                deferred.resolve(pos);

            }, function(error) {
                latLong = null
                
                deferred.reject('Failed to Get Lat Long')

            });
            
            return deferred.promise;

        };
        
        return {
            
            getLatLong : getLatLong
            
        }
    });