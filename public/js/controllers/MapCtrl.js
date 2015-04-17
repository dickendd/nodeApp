angular.module('bearApp').controller('MapCtrl', 
	['$scope', 
	'BearService', 
	'LocationService', 
	'uiGmapIsReady', 
	function($scope, BearService, LocationService, IsReady){

		$scope.bearService = BearService;
		$scope.locationService = LocationService;
		$scope.bears;
		$scope.status;
		$scope.render = true;
		$scope.markers = [];
		$scope.windowOptions = {
			visible: false
		};
		$scope.title = 'Default InfoWindow';

		$scope.onClick = function(data){
			$scope.windowOptions.visible = !$scope.windowOptions.visible;
		}

		$scope.closeClick = function(){
			$scope.windowOptions.visible = false;
		}

		// getBears();
		$scope.locationService.getLatLong().then(function(latLong){
			$scope.position = {
				coords: {
					latitude: latLong.lat, 
					longitude: latLong.long
				}
			}
		})

		function createMarkers(bears){
			var markers = [];
			for(var i = 0; i < bears.length; i++){
				var lat = bears[i].geo.coords.latitude;
				var lng = bears[i].geo.coords.longitude;
				var name = bears[i].name;
				var id = bears[i]._id;
				markers.push({
					idKey: id,
					options: {
		                title: name
					},
	                latitude: lat,
	                longitude: lng,
	                show: true
	            });

	            $scope.markers = markers;
	        }
		}

		$scope.addMarkerClickFunction = function (markersArray) {
	        angular.forEach(markersArray, function (value, key) {
	            value.onClick = function () {
	            	console.log('hello');
	                $scope.onClick(value.options.title);
	                $scope.MapOptions.markers.selected = value;
	            };
	        });
	    };

		function getBears(){
			$scope.bearService.get()
				.success(function(bears){
					createMarkers(bears);
			        $scope.addMarkerClickFunction($scope.markers);
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

		function initialize() {
			console.log('initializing...');
	        $scope.map = {
		    	center: { 
		    		latitude: 364,
		    		longitude: -76
		    	}, 
		    	zoom: 14,
		    	options: $scope.MapOptions
		    };
		    IsReady.promise()
			    .then(function(maps){
			    	console.log('Ready!');
			    	centerMap();
				    getBears();
			    })
	    }
	    google.maps.event.addDomListener(window, 'load', initialize());

	    $scope.MapOptions = {
	        markers: {
	            selected: {}
	        }
	    };
}])