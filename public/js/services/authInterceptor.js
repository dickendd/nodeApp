angular.module('truckApp').factory('authInterceptor', ['$q', '$location', '$window', function($q, $location, $window) {  
    var authInterceptor = {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function(response) {
            if(response.status === 401 || response.status === 403) {
                $location.path('/login');
            }
            return $q.reject(response);
        }
    };

    return authInterceptor;
}]);