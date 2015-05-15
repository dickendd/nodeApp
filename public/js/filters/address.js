// Address filter

angular.module('truckApp').filter('address', function(){
	return function(input) {
		return input.split(', USA')[0];
	}
});