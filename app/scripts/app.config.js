'use strict';

angular.module('rssApp').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    $locationProvider.hashPrefix('!');

    $routeProvider.
    when('/reader/:rssId', {
        template: '<reader></reader>' + '<messages></messages>'
    }).
    when('/reader/:rssId/:messageId', {
        template: '<reader></reader>' + '<messages></messages>'
    }).
    when('/reader', {
        template: '<reader></reader>'
    }).
    otherwise('/reader');

}]);