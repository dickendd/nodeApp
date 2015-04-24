// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    console.log($localStorage.token);
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
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

        // bears page that will use the BearController
        .when('/bears', {
            templateUrl: 'views/bear.html',
            controller: 'BearCtrl'
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
            controller: 'AdminUserCtrl'
        })

    $locationProvider.html5Mode(true);
}]);
