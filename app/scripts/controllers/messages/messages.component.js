'use strict';

var messages = angular.module('messages');

messages.component('messages', {
    templateUrl: './scripts/controllers/messages/messages.template.html',

    controller: ['getContent', 'localService', '$routeParams', '$scope', function(getContent, localService, $routeParams, $scope){

        $scope.rssId = $routeParams.rssId;
        var feedUrl = localService.getFeed($routeParams.rssId);
        getContent.get({url: feedUrl}).$promise.then(function(data){
            $scope.items = localService.setMessagesState(feedUrl, data.items);
            $scope.itemsCount = data.items.length;
            var authArr = [];
            $scope.authCount = 0;
            for (var i =0; i < data.items.length; i++){
               authArr[data.items[i].author] = 1;
            }
            for (var auth in authArr){
                ++$scope.authCount;
            }
        });

        $scope.showMessage = function(id){
            $scope.message = $scope.items[id];
            $scope.items[id].read = true;
            localService.updateMessageStatus(feedUrl, $scope.items[id].link);
            renderChart($scope.message);
        };


        $scope.mf = {value: false};
        $scope.unreadFilter = function(){
            if ($scope.mf.value){
                return {read: false};
            }
        };

        $scope.clear = function(){
            for (var i =0; i < $scope.items.length; i++){
                $scope.items[i].read = false;
            }
            localService.clearMessagesState(localService.getFeed($routeParams.rssId));
            localService.setMessagesState(feedUrl, $scope.items);
        };

        function renderChart(message) {
            var counts = {};
            var ch, i, count;
            var str = message.description.toLowerCase();

            for (i = 0; i < str.length; i++) {
                if (str.charAt(i).match(/[a-zа-яё]/i) != null) {
                    ch = str.charAt(i);
                    count = counts[ch];
                    counts[ch] = count ? count + 1 : 1;
                }
            }

            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var chartArr=[["letter", "count"]];
                for (var key in counts){
                    chartArr.push([key, counts[key]]);
                }
                var data = google.visualization.arrayToDataTable(chartArr);
                var options = {
                    legend: 'none',
                    pieSliceText: 'label'
                };
                var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                chart.draw(data, options);
            }
        }
    }]
});