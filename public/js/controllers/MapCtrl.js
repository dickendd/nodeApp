angular.module('truckApp').controller('MapCtrl', 
	['$scope', 
	'TruckService', 
	'LocationService', 
	'uiGmapGoogleMapApi', 
	'uiGmapIsReady', 
	'$q',
	'AuthService',
	function($scope, TruckService, LocationService, uiGmapGoogleMapApi, uiGmapIsReady, $q, AuthService){

		$scope.truckService = TruckService;
		$scope.locationService = LocationService;
		$scope.trucks;
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
			$scope.address = data.address;
			$scope.menuUrl = data.menuUrl;
			$scope.dateModified = data.dateModified;
			$scope.windowOptions.visible = !$scope.windowOptions.visible;
			$scope.windowOptions.pixelOffset = new window.google.maps.Size(0, -30);
		}

		$scope.closeClick = function(){
			$scope.windowOptions.visible = false;
		}

		uiGmapGoogleMapApi.then(function(maps){
	        $scope.googlemap = {};
	        $scope.map = {
	            center: {
	                latitude: 36.8458816,
	                longitude: -76.2884479
	            },
	            zoom: 12,
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

		function createMarkers(trucks){
			var deferred = $q.defer();
			var markers = [];

			for(var i = 0; i < trucks.length; i++){
				var lat = trucks[i].geo.coordinates[1];
				var lng = trucks[i].geo.coordinates[0];
				var address = trucks[i].address;
				var name = trucks[i].name;
				var windowCopy = trucks[i].windowCopy;
				var menuUrl = trucks[i].menuUrl;
				var dateModified = trucks[i].dateModified;
				var id = i;
				markers.push({
					id: id,
					options: {
		                title: name,
		                address: address,
		                windowCopy: windowCopy,
		                menuUrl: menuUrl,
		                dateModified: dateModified,
		                icon: '../images/FoodTruckIcon.png'
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

		function getTrucks(){
			var deferred = $q.defer();

			$scope.truckService.get()
				.success(function(trucks){
					deferred.resolve(trucks);
				})
				.error(function(err){
					deferred.reject(err);
					$scope.status = 'Unable to load trucks: ' + err.message;
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
	                	latitude: latLong.coords.latitude, 
	                	longitude: latLong.coords.longitude
	                };

	                $scope.map.zoom = 15;
	            },
	            
	            function(error) {
	                alert(error);
	            }
	        )
		};

		$scope.centerMap = centerMap;

	    uiGmapIsReady.promise()
	    .then(function (instances) {
	        getTrucks()
	        .then(function(trucks){
	        	createMarkers(trucks)
	        	.then(function(markers){
	        		centerMap();
	        		$scope.addMarkerClickFunction(markers);
	        	});
	        });
	    });
}]);