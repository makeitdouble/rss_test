'use strict';

var reader = angular.module('reader');

reader.component('reader', {
    templateUrl: './scripts/controllers/reader/reader.template.html',

    controller: ['$routeParams', '$scope', 'localService', function($routeParams, $scope, localService){

        $scope.rssFeeds = localService.getAllFeeds();

        $scope.addFeed = function(feed){
            localService.addFeed(feed);
        }
    }]
});