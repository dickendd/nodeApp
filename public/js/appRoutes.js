// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

    $httpProvider.interceptors.push('authInterceptor');

    $stateProvider
        .state('index', {
          url: '/',
          templateUrl: 'views/map.html',
          controller: 'MapCtrl'
        })
        .state('trucks', {
          url: '/trucks',
          templateUrl: 'views/truck.html',
          controller: 'TruckCtrl',
          data: {
            authorizedRoles: USER_ROLES.admin
          }
        })
        .state('login', {
          url: '/login',
          templateUrl: 'views/login.html',
          controller: 'AdminUserCtrl'
        })
        .state('signup', {
          url: '/signup',
          templateUrl: 'views/signup.html',
          controller: 'AdminUserCtrl'
        })
        .state('me', {
          url: '/me',
          templateUrl: 'views/profile.html',
          controller: 'ProfileCtrl',
          data: {
            authorizedRoles: USER_ROLES.user
          }
        });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
}]);
