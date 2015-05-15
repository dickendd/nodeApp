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

		$scope.updateLocation = function(truck){
			$scope.locationService.getLatLong().then(function(latLong){
				$scope.position = latLong;
				if(truck){
					$scope.resetAddress(truck, $scope.position);
				}
			});
		}

		$scope.updateLocation();

		function formSubmit(){

			var geo = {
				type: 'Point',
				coordinates: []
			};
			var errors = [];

			if($scope.newTruck.address !== null && $scope.newTruck.address !== '' && $scope.newTruck.address !== 'undefined'){

				$scope.geocoderService.codeAddress($scope.newTruck.address).then(
					function(response){

						geo.coordinates[0] = response[0].geometry.location.lng();
						geo.coordinates[1] = response[0].geometry.location.lat();

						createTruck($scope.newTruck.name, $scope.newTruck.address, geo, $scope.newTruck.windowCopy, $scope.newTruck.menuUrl, $scope.currentUser._id);
					}, 
					function(error){
						errors.push(error);
					});

			} else if($scope.position != null){

				geo.coordinates[0] = $scope.position.coords.longitude;
				geo.coordinates[1] = $scope.position.coords.latitude;

				$scope.geocoderService.codeLatLng(geo.coordinates[1], geo.coordinates[0]).then(function(response){
					$scope.newTruck.address = response[0].formatted_address.split(', USA')[0];
					createTruck($scope.newTruck.name, $scope.newTruck.address, geo, $scope.newTruck.windowCopy, $scope.newTruck.menuUrl, $window.sessionStorage.userId);
				});
			} else {
				alert('No location found, please allow us to see your location, or input an address.');
				return;
			}
		}
		$scope.formSubmit = formSubmit;

		function createTruck(name, address, geo, windowCopy, menuUrl, createdBy){

			// address = address || '';

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

		$scope.editTruck = function(truckId, truckName, windowCopy, menuUrl, coords, address, callback){

			var geo = {
				type: 'Point',
				coordinates: []
			};

			if(address != '' && address != null){
				$scope.geocoderService.codeAddress(address).then(
					function(response){
						geo.coordinates = [response[0].geometry.location.lng(), response[0].geometry.location.lat()];

						$scope.truckService.update(truckId, { 
							name: truckName,
							geo: geo,
							address: address,
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
					}, 
					function(error){
						errors.push(error);
					});
			} else {
				geo.coordinates = [coords.coords.longitude, coords.coords.latitude];
				$scope.truckService.update(truckId, { 
					name: truckName,
					geo: geo,
					address: address,
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
			}

			
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

		function reverseGeoCode(lat, lng){
			$scope.geocoderService.codeLatLng(lat, lng).then(function(response){
				console.log(response[0].formatted_address);
			});
		}

		$scope.resetAddress = function(truck, position){
			$scope.geocoderService.codeLatLng(position.coords.latitude, position.coords.longitude).then(function(response){
				truck.address = response[0].formatted_address;
			});
		};

	}]);
