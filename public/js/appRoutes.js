// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/map.html',
            controller: 'MapCtrl'
        })

        // bears page that will use the BearController
        .when('/bears', {
            templateUrl: 'views/bear.html',
            controller: 'BearCtrl'
        })

    $locationProvider.html5Mode(true);

}]);
