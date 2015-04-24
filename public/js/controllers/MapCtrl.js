angular.module('bearApp').controller('MapCtrl', 
	['$scope', 
	'BearService', 
	'LocationService', 
	'uiGmapGoogleMapApi', 
	'uiGmapIsReady', 
	'$q',
	function($scope, BearService, LocationService, uiGmapGoogleMapApi, uiGmapIsReady, $q){

		uiGmapGoogleMapApi.then(function (maps) {
	        $scope.googlemap = {};
	        $scope.map = {
	            center: {
	                latitude: 36.86,
	                longitude: -76.29
	            },
	            zoom: 11,
	            pan: 1,
	            options: $scope.mapOptions,
	            control: {},
	            events: {
	                tilesloaded: function (maps, eventName, args) {},
	                dragend: function (maps, eventName, args) {},
	                zoom_changed: function (maps, eventName, args) {}
	            }
	        };
	    });

		$scope.bearService = BearService;
		$scope.locationService = LocationService;
		$scope.bears;
		$scope.status;
		$scope.render = true;
		$scope.markers = [];
		$scope.windowOptions = {
			visible: false
		};
		$scope.title = 'Loading...';
		$scope.windowCopy = 'Default window copy.';
		$scope.menuUrl = 'http://google.com';
		$scope.mapOptions = {
	        markers: {
	            selected: {}
	        }
	    };
	    $scope.templateUrl = '../views/templates/window.html';

		$scope.onClick = function(data){
			$scope.title = data.title;
			$scope.windowCopy = data.windowCopy;
			$scope.menuUrl = data.menuUrl;
			$scope.windowOptions.visible = !$scope.windowOptions.visible;
			$scope.windowOptions.pixelOffset = new window.google.maps.Size(0, -35);
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
			var deferred = $q.defer();
			var markers = [];

			for(var i = 0; i < bears.length; i++){
				var lat = bears[i].geo.coords.latitude;
				var lng = bears[i].geo.coords.longitude;
				var name = bears[i].name;
				var windowCopy = bears[i].windowCopy;
				var menuUrl = bears[i].menuUrl;
				var id = i;
				markers.push({
					id: id,
					options: {
		                title: name,
		                windowCopy: windowCopy,
		                menuUrl: menuUrl
					},
					coords: {
		                latitude: lat,
		                longitude: lng
		            },
	                show: true
	            });

	            $scope.markers = markers;
	            deferred.resolve($scope.markers);
	        }

	        return deferred.promise;
		}

	    $scope.addMarkerClickFunction = function (markersArray) {
	        angular.forEach(markersArray, function (value, key) {
	            value.onClick = function () {
	                $scope.onClick(value.options);
	                $scope.mapOptions.markers.selected = value;
	            };
	        });
	    };

		function getBears(){
			var deferred = $q.defer();

			$scope.bearService.get()
				.success(function(bears){
					deferred.resolve(bears);
				})
				.error(function(err){
					deferred.reject(err);
					$scope.status = 'Unable to load bears: ' + err.message;
				});

			return deferred.promise;
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

	    uiGmapIsReady.promise() // if no value is put in promise() it defaults to promise(1)
	    .then(function (instances) {
	        centerMap();
	        getBears()
	        .then(function(bears){
	        	createMarkers(bears)
	        	.then(function(markers){
	        		$scope.addMarkerClickFunction(markers);
	        	});
	        });
	    });
}]);