// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.interceptors.push(['$q', '$location', '$window', function($q, $location, $window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/map.html',
            controller: 'MapCtrl'
        })

        // trucks page that will use the TruckController
        .when('/trucks', {
            templateUrl: 'views/truck.html',
            controller: 'TruckCtrl'
        })

        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AdminUserCtrl'
        })

        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'AdminUserCtrl'
        })

        .when('/me', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl'
        })

    $locationProvider.html5Mode(true);
}]);
