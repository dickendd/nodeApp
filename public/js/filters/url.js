// Url filter

angular.module('truckApp').filter('url', function(){
    return function(input) {
        if (input.indexOf('http://') > -1) {
            return input;
        } else {
            return 'http://' + input;
        }
    }
});