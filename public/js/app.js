var app = angular.module('truckApp', ['ui.router', 'uiGmapgoogle-maps', 'ngStorage'])
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	}).constant('USER_ROLES', {
		all: '*',
		admin: 'ADMIN',
		user: 'USER'
	}).config(['$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', 'USER_ROLES', function($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, USER_ROLES) {

	    $httpProvider.interceptors.push('authInterceptor');

	    $stateProvider
	        .state('index', {
	          url: '/',
	          templateUrl: 'views/map.html',
	          controller: 'MapCtrl',
	          data: {
	            authorizedRoles: [USER_ROLES.all]
	          }
	        })
	        .state('trucks', {
	          url: '/trucks',
	          templateUrl: 'views/truck.html',
	          controller: 'TruckCtrl',
	          data: {
	            authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
	          }
	        })
	        .state('truck', {
	          url: '/:id',
	          templateUrl: 'views/map.html',
	          controller: 'MapCtrl'
	        })
	        .state('login', {
	          url: '/login',
	          templateUrl: 'views/login.html',
	          controller: 'AdminUserCtrl',
	          data: {
	            authorizedRoles: [USER_ROLES.all]
	          }
	        })
	        .state('signup', {
	          url: '/signup',
	          templateUrl: 'views/signup.html',
	          controller: 'AdminUserCtrl',
	          data: {
	          	authorizedRoles: [USER_ROLES.admin]
	          }
	        })
	        .state('me', {
	          url: '/me',
	          templateUrl: 'views/profile.html',
	          controller: 'ProfileCtrl',
	          data: {
	            authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
	          }
	        });

	    $urlRouterProvider.otherwise('/');

	    $locationProvider.html5Mode(true);
	}]);

	angular.module('truckApp').run(
		['$rootScope', 
		'$state', 
		'AUTH_EVENTS', 
		'USER_ROLES', 
		'AuthService', 
		'$location', 
		'$http', function($rootScope, $state, AUTH_EVENTS, USER_ROLES, AuthService, $location){
        $rootScope.$on('$stateChangeStart', function (event, next, toParams, fromState, fromParams) {
            if (next.data) {
                var authorizedRoles = next.data.authorizedRoles;
            } else {
                var authorizedRoles = [USER_ROLES.all];
            }
            if (!AuthService.isAuthorized(authorizedRoles) && next.name !== 'login' && next.name !== 'index' && next.name !== 'signup' && next.name !== 'truck') {
                // event.preventDefault();
                if (AuthService.isAuthenticated()) {
                	console.log('not authorized');
                    // user is not allowed
                    $rootScope.errors = AUTH_EVENTS.notAuthorized;
                    $location.path('/');
                } else {
                	console.log('not authenticated');
                    // user is not logged in
                    $rootScope.errors = AUTH_EVENTS.notAuthenticated;
                    $location.path('/login');
                }
            }
        });
    }]);