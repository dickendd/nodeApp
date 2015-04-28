angular.module('truckApp')
  .factory('Geocoder', function ($q) {

    var geocoder = new google.maps.Geocoder();
    var latLng;
    // var address = '1320 Bolling Ave, Norfolk, VA';

    var codeAddress = function(address){

      var deferred = $q.defer();

      geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

          latLng = results;

          deferred.resolve(latLng);

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
          deferred.reject('Failed to Get Lat Long')
        }
      });

      return deferred.promise;
    }

    var codeLatLng = function(lat, lng){

      var deferred = $q.defer();
      var latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode( { 'latLng': latlng}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

          address = results;

          deferred.resolve(address);

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
          deferred.reject('Failed to Get Lat Long')
        }
      });

      return deferred.promise;
    }

    return {
      codeAddress : codeAddress,
      codeLatLng : codeLatLng
    }
  });