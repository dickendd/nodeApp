angular.module('bearApp').controller('MapCtrl', 
	['$scope', 
	'BearService', 
	'LocationService', 
	function($scope, BearService, LocationService){

		$scope.bearService = BearService;
		$scope.locationService = LocationService;
		$scope.bears;
		$scope.status;
		$scope.render = true;

		getBears();
		$scope.locationService.getLatLong().then(function(latLong){
			$scope.position = {
				coords: {
					latitude: latLong.lat, 
					longitude: latLong.long
				}
			}
		})

		function getBears(){
			$scope.bearService.get()
				.success(function(bears){
					$scope.bears = bears;
				})
				.error(function(err){
					$scope.status = 'Unable to load bears: ' + err.message;
				});
		}

		function centerMap() {
		    if(!$scope.map) {
	            return;
	        }
	        
	        $scope.locationService.getLatLong().then(
	            function(latLong) {
	                $scope.latLong = latLong;
	                
	                $scope.map.center = {
	                	latitude: latLong.lat, 
	                	longitude: latLong.long
	                };

	            },
	            
	            function(error) {
	                alert(error);
	            }
	        )
		};

		function initialize() {;
	        $scope.map = {
		    	center: { 
		    		latitude: 364,
		    		longitude: -76
		    	}, 
		    	zoom: 17
		    };
			centerMap();
	    }
	    google.maps.event.addDomListener(window, 'load', initialize());
}])