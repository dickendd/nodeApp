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
		var position;

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
				// console.log($scope.position);
			});
		}

		$scope.updateLocation();

		function createBear(){
			// console.log($scope.address);
			console.log($scope.position);
			if($scope.address != null){
				$scope.position = null;
				// console.log($scope.address);
				$scope.geocoderService.codeAddress($scope.address).then(function(response){

					$scope.position = {
						coords: {
							latitude: response[0].geometry.location.k,
							longitude: response[0].geometry.location.D
						}
					}

					var lat = $scope.position.coords.latitude;
					var lng = $scope.position.coords.longitude;
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

				});
			} else if($scope.position != null){
				var lat = $scope.position.coords.latitude;
				var lng = $scope.position.coords.longitude;
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
			} else {
				alert('No location found, please allow us to see your location, or input an address.');
				return;
			}
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
// console.log(response);
				$scope.geocodedAddress = response[0].formatted_address;

			});
		}

		$scope.checkboxClicked = function(index, event){
			alert("checkbox " + index + " is " + $scope.checkbox[index]);
		}

	}]);
