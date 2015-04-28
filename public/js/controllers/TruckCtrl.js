// public/js/controllers/TruckCtrl.js
angular.module('truckApp').controller('TruckCtrl', 
	['$scope', 
	'TruckService', 
	'LocationService',
	'Geocoder',
	function($scope, TruckService, LocationService, Geocoder) {

		$scope.truckService = TruckService;
		$scope.locationService = LocationService;
		$scope.geocoderService = Geocoder;
		$scope.trucks;
		$scope.status;
		$scope.geocodedLatLng;
		$scope.address = null;
		$scope.latitude;
		$scope.longitude;
		$scope.position;
		$scope.checkboxes = [];

		getTrucks();

		function getTrucks(){
			$scope.truckService.get()
				.success(function(trucks){
					$scope.trucks = trucks;
				})
				.error(function(err){
					$scope.status = 'Unable to load trucks: ' + err.message;
				});
		}

		$scope.updateLocation = function(){
			$scope.locationService.getLatLong().then(function(latLong){
				$scope.position = {
					coords: {
						latitude: latLong.lat, 
						longitude: latLong.long
					}
				}
			});
		}

		$scope.updateLocation();

		function formSubmit(){

			var geo = {
				type: 'Point',
				coords: {
					latitude: '', 
					longitude: ''
				}
			};
			var errors = [];

			if($scope.address !== null && $scope.address !== '' && $scope.address !== 'undefined'){
				$scope.geocoderService.codeAddress($scope.address).then(
					function(response){

						geo.coords.latitude = response[0].geometry.location.k;
						geo.coords.longitude = response[0].geometry.location.D;

						createTruck($scope.truck.name, $scope.address, geo, $scope.truck.windowCopy, $scope.truck.menuUrl);
					}, 
					function(error){
						errors.push(error);
					});

			} else if($scope.position != null){

				geo.coords = $scope.position.coords;

				createTruck($scope.truck.name, null, geo, $scope.truck.windowCopy, $scope.truck.menuUrl);

			} else {
				alert('No location found, please allow us to see your location, or input an address.');
				console.log(errors);
				return;
			}
		}
		$scope.formSubmit = formSubmit;

		function createTruck(name, address, geo, windowCopy, menuUrl){

			address = address || '';

			$scope.truckService.create({ 
				name: name,
				address: address,
				geo: geo,
				windowCopy: windowCopy,
				menuUrl: menuUrl
			})
			.success(function(trucks){
				$scope.status = 'Successfully added ' + $scope.truck.name;
				$scope.truck.name = null;
				$scope.truck.address = null;
				$scope.truck.windowCopy = null;
				$scope.truck.menuUrl = null;
				getTrucks();
			})
			.error(function(err){
				$scope.status = 'Something went wrong: ' + err.message;
			});
		};

		$scope.createTruck = createTruck;

		$scope.editTruck = function(truckId, truckName, coords, windowCopy, menuUrl){
			$scope.truckService.update(truckId, { 
				name: truckName,
				geo: {
					type: 'Point',
					coords: coords
				},
				windowCopy: windowCopy,
				menuUrl: menuUrl
			})
				.success(function(trucks){
					$scope.status = 'Successfully edited truck';
					getTrucks();
				})
				.error(function(err){
					$scope.status = 'Something went wrong: ' + err.message;
				});
		};

		$scope.deleteTruck = function(truckId){
			$scope.truckService.delete(truckId)
				.success(function(trucks){
					$scope.status = 'Successfully removed truck';
					getTrucks();
				})
				.error(function(err){
					$scope.status = 'Something went wrong: ' + err.message;
				});
		};

		$scope.reverseGeoCode = function(lat, lng){

			$scope.geocoderService.codeLatLng(lat, lng).then(function(response){

				$scope.geocodedAddress = response[0].formatted_address;

			});
		}

	}]);
