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
				console.log($scope.position);
			});
		}

		$scope.updateLocation();

		$scope.createBear = function(){
			if($scope.position){
				var lat = $scope.position.coords.latitude;
				var lng = $scope.position.coords.longitude;
			} else {
				alert('No location found, please allow us to see your location, or input an address.');
			}
			$scope.bearService.create({ 
				name: $scope.bear.name,
				geo: {
					type: 'Point',
					coords: {
						latitude: lat, 
						longitude: lng
					}
				} 
			})
				.success(function(bears){
					$scope.status = 'Successfully added ' + $scope.bear.name;
					$scope.bear.name = null;
					getBears();
				})
				.error(function(err){
					$scope.status = 'Something went wrong: ' + err.message;
				});
		};

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

		$scope.geoCodeMyAddress = function(address){
			
			$scope.geocoderService.codeAddress(address).then(function(response){

				$scope.position = {
					coords: {
						latitude: response[0].geometry.location.k,
						longitude: response[0].geometry.location.D
					}
				}

			});
		}

		$scope.reverseGeoCode = function(lat, lng){

			$scope.geocoderService.codeLatLng(lat, lng).then(function(response){
console.log(response);
				$scope.geocodedAddress = response[0].formatted_address;

			});
		}

		$scope.checkboxClicked = function(index, event){
			alert("checkbox " + index + " is " + $scope.checkbox[index]);
		}

	}]);
