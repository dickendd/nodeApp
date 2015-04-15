// public/js/controllers/BearCtrl.js
angular.module('bearApp').controller('BearCtrl', 
	['$scope', 
	'BearService', 
	'LocationService',
	'Geocoder',
	function($scope, BearService, LocationService, Geocoder) {

		$scope.bearService = BearService;
		$scope.locationService = LocationService;
		$scope.geocoderService = Geocoder;
		$scope.bears;
		$scope.status;
		$scope.geocodedLatLng;
		$scope.address;
		$scope.latitude;
		$scope.longitude;
		$scope.position;
		$scope.checkboxes = [];

		getBears();

		function getBears(){
			$scope.bearService.get()
				.success(function(bears){
					$scope.bears = bears;
				})
				.error(function(err){
					$scope.status = 'Unable to load bears: ' + err.message;
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

			if($scope.address !== null && $scope.address !== ''){

				$scope.geocoderService.codeAddress($scope.address).then(
					function(response){

						geo.coords.latitude = response[0].geometry.location.k;
						geo.coords.longitude = response[0].geometry.location.D;

						createBear($scope.bear.name, $scope.address, geo);
					}, 
					function(error){
						errors.push(error);
					});

			} else if($scope.position != null){

				geo.coords = $scope.position.coords;

				createBear($scope.bear.name, geo);

			} else {
				alert('No location found, please allow us to see your location, or input an address.');
				console.log(errors);
				return;
			}
		}
		$scope.formSubmit = formSubmit;

		function createBear(name, address, geo){

			address = address || '';

			$scope.bearService.create({ 
				name: name,
				address: address,
				geo: geo
			})
			.success(function(bears){
				$scope.status = 'Successfully added ' + $scope.bear.name;
				$scope.bear.name = null;
				$scope.bear.address = null;
				getBears();
			})
			.error(function(err){
				$scope.status = 'Something went wrong: ' + err.message;
			});
		};

		$scope.createBear = createBear;

		$scope.editBear = function(bearId, bearName, coords){
			$scope.bearService.update(bearId, { 
				name: bearName,
				geo: {
					type: 'Point',
					coords: coords
				} 
			})
				.success(function(bears){
					$scope.status = 'Successfully edited bear';
					getBears();
				})
				.error(function(err){
					$scope.status = 'Something went wrong: ' + err.message;
				});
		};

		$scope.deleteBear = function(bearId){
			$scope.bearService.delete(bearId)
				.success(function(bears){
					$scope.status = 'Successfully removed bear';
					getBears();
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

		$scope.checkboxClicked = function(index, event){
			alert("checkbox " + index + " is " + $scope.checkbox[index]);
		}

	}]);
