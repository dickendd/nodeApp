angular.module('truckApp')
    .factory('AuthService', ['$http', '$window', 'Session', function($http, $window, Session){
        var authService = {};
        var baseUrl = "";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
 
        function getUserFromToken() {
            var token = $window.sessionStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }
 
        var currentUser = getUserFromToken();

        authService.save = function(data, success, error) {
                $http.post(baseUrl + '/signup', data).success(success).error(error)
            };
        authService.login = function(data, success, error) {
            return $http.post(baseUrl + '/login', data).success(function (res) {
                Session.create(res.data.token, res.data._id, res.data.role);
                return res;
            });
        };
        authService.me = function(success, error) {
            $http.get(baseUrl + '/me').success(success).error(error)
        };
        authService.isAuthenticated = function() {
            return !!Session.userId;
        };
        authService.isAuthorized = function(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
              authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
              authorizedRoles.indexOf(Session.userRole) !== -1);
        };
 
        return authService
    }
]);
