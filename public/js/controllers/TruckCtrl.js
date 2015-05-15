// public/js/controllers/TruckCtrl.js
angular.module('truckApp').controller('TruckCtrl', 
	['$scope', 
	'TruckService', 
	'LocationService',
	'Geocoder',
	'$window', 
	function($scope, TruckService, LocationService, Geocoder, $window) {

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
		$scope.newTruck = {
			name: null,
			address: null,
			geo: null,
			windowCopy: 'Infowindow copy',
			menuUrl: 'Menu Url',
			createdBy: null
		};
		$scope.userHasTrucks = false;
		$scope.userTrucks = [];
		$scope.editingTruck = false;
		$scope.mouseOver = false;

		$scope.setEditing = function(){
			if (!$scope.editingTruck) {
				$scope.editingTruck = true;
			} else {
				$scope.editingTruck = false;
			}
		}

		function getTrucks(){
			$scope.truckService.get()
				.success(function(trucks){
					$scope.trucks = trucks;
				})
				.error(function(err){
					$scope.status = 'Unable to load trucks: ' + err.message;
				});
		}

		function getUserTruck(){
			$scope.truckService.getByUser($window.sessionStorage.userId)
				.success(function(truck){
					$scope.userTrucks= truck;

					$scope.userHasTrucks = $scope.userTrucks.length > 0;
				})
				.error(function(err){
					$scope.status = 'Unable to load trucks: ' + err.message;
				})
		}

		getUserTruck();

		$scope.updateLocation = function(){
			$scope.locationService.getLatLong().then(function(latLong){
				$scope.position = latLong;
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

			if($scope.newTruck.address !== null && $scope.newTruck.address !== '' && $scope.newTruck.address !== 'undefined'){

				$scope.geocoderService.codeAddress($scope.newTruck.address).then(
					function(response){

						geo.coords.latitude = response[0].geometry.location.lat();
						geo.coords.longitude = response[0].geometry.location.lng();

						createTruck($scope.newTruck.name, $scope.newTruck.address, geo, $scope.newTruck.windowCopy, $scope.newTruck.menuUrl, $scope.currentUser._id);
					}, 
					function(error){
						errors.push(error);
					});

			} else if($scope.position != null){

				geo.coords.latitude = $scope.position.coords.latitude;
				geo.coords.longitude = $scope.position.coords.longitude;

				createTruck($scope.newTruck.name, null, geo, $scope.newTruck.windowCopy, $scope.newTruck.menuUrl, $window.sessionStorage.userId);

			} else {
				alert('No location found, please allow us to see your location, or input an address.');
				return;
			}
		}
		$scope.formSubmit = formSubmit;

		function createTruck(name, address, geo, windowCopy, menuUrl, createdBy){

			address = address || '';

			$scope.truckService.create({ 
				name: name,
				address: address,
				geo: geo,
				windowCopy: windowCopy,
				menuUrl: menuUrl,
				createdBy: createdBy
			})
			.success(function(trucks){
				$scope.status = 'Successfully added ' + $scope.newTruck.name;
				$scope.newTruck.name = null;
				$scope.newTruck.address = null;
				$scope.newTruck.windowCopy = null;
				$scope.newTruck.menuUrl = null;
				$scope.newTruck.createdBy = null;
				getUserTruck();
			})
			.error(function(err){
				$scope.status = 'Something went wrong: ' + err.message;
			});
		};

		$scope.createTruck = createTruck;

		$scope.editTruck = function(truckId, truckName, windowCopy, menuUrl, coords, callback){
			$scope.truckService.update(truckId, { 
				name: truckName,
				geo: {
					type: 'Point',
					coords: {
						latitude: coords.coords.latitude,
						longitude: coords.coords.longitude
					}
				},
				windowCopy: windowCopy,
				menuUrl: menuUrl
			})
				.success(function(trucks){
					$scope.status = 'Successfully edited truck';
					getUserTruck();
					callback();
				})
				.error(function(err){
					$scope.status = 'Something went wrong: ' + err.message;
				});
		};

		$scope.deleteTruck = function(truckId){
			$scope.truckService.delete(truckId)
				.success(function(trucks){
					$scope.status = 'Successfully removed truck';
					getUserTruck();
					$scope.updateLocation();
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
