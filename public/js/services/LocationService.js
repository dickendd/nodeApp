angular.module('bearApp')
    .factory('LocationService', function($q) {
        
        var latLong = null;
        
        var getLatLong = function(refresh) {
            
            var deferred = $q.defer();
            
            navigator.geolocation.getCurrentPosition(function(pos) {
                latLong =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude } 
                deferred.resolve(latLong);

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