angular.module('truckApp').controller('MapCtrl', 
	['$scope', 
	'$rootScope', 
	'TruckService', 
	'LocationService', 
	'UserLocationService', 
	'uiGmapGoogleMapApi', 
	'uiGmapIsReady', 
	'$q',
	'AuthService',
	'$location',
	function($scope, $rootScope, TruckService, LocationService, UserLocationService, uiGmapGoogleMapApi, uiGmapIsReady, $q, AuthService, $location){

		$scope.map;
		$scope.realMap;
		$scope.showHeat = false;
		$scope.truckService = TruckService;
		$scope.locationService = LocationService;
		$scope.userLocationService = UserLocationService;
		$scope.trucks;
		$scope.status;
		$scope.render = true;
		$scope.markers = function(){
			return [];
		};
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
				},
				showHeat: false
			};
		});

		$scope.heatLayerCallback = function (layer) {
			//set the heat layers backend data
			heatLayer = new HeatLayer(layer);
			$scope.toggleHeatMap();
		}

		$scope.toggleHeatMap = function() {
			// hideMarkers();
			if (heatLayer.getMap() !== null) {
				heatLayer.setMap(null);
			} else {
				heatLayer.setMap(realMap);
			}
			$scope.map.showHeat = !$scope.map.showHeat;
		}

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
						icon: '../images/FoodTruckIcon.png',
						visible: true
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

		function hideMarkers(){
			// angular.forEach($scope.markers, function(value, key){
			// 	value.show = false;
			// 	value.options.visible = false;
			// });
			// console.log($scope.map);
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

		function getUserTruck(userId){
			var deferred = $q.defer();

			$scope.truckService.getByUser(userId)
				.success(function(truck){
					deferred.resolve(truck);
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

					addUserLocation(latLong);
				},
				
				function(error) {
					console.log(error);
				}
			)
		};

		function centerMapOnTruck(truck) {
			if (!$scope.map) {
				return;
			}
			if (truck) {
				$scope.map.center = {
					longitude: truck[0].geo.coordinates[0],
					latitude: truck[0].geo.coordinates[1]
				}
			} else {
				$scope.center();
			}

			$scope.map.zoom = 13;
		}

		$scope.centerMap = centerMap;

		uiGmapIsReady.promise(1)
		.then(function (instances) {
			instances.forEach(function(inst){
				realMap = inst.map;
			});
			if($location.path() !== '/') {
				getUserTruck($location.path().replace('/truck/', ''))
				.then(function(trucks){
					createMarkers(trucks)
					.then(function(markers){
						centerMapOnTruck(trucks);
						$scope.addMarkerClickFunction(markers);
					});
				});
			} else {
				getTrucks()
				.then(function(trucks){
					createMarkers(trucks)
					.then(function(markers){
						centerMap();
						$scope.addMarkerClickFunction(markers);
					});
				});
			}
		});

		function addUserLocation(loc) {
			var request = {
				geo: {
					type: 'Point',
					coordinates: [loc.coords.latitude, loc.coords.longitude]
				},
				dateModified: Date.now()
			};
			$scope.userLocationService.create(request);
		}

		function getUserLocations(){
			var deferred = $q.defer()
			$scope.userLocationService.get()
			.then(function(locs){
				deferred.resolve(locs);
			});
			return deferred.promise;
		}

		var userLocs = [];

		getUserLocations().then(function(locs){
			for(var i = 0; i < locs.data.length; i++){
				userLocs.push(
					new google.maps.LatLng(locs.data[i].geo.coordinates[0], locs.data[i].geo.coordinates[1])
				);
			}
		});

		HeatLayer = function (heatLayer) {
			var map, pointarray;

			pointArray = new google.maps.MVCArray(userLocs);
			heatLayer.setData(pointArray);

			return heatLayer;
		}

		$scope.addUserLocation = addUserLocation;
}]);