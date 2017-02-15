'use strict';
var rssApp = angular.module('rssApp');

rssApp.factory('getContent', ['$resource', function($resource){
    return $resource('https://api.rss2json.com/v1/api.json?rss_url=:url&api_key=u1drnr6dxidvcm4llyclo5oh9lr6cdjehyao7hb9', {}, {
        get:{
            method: 'GET',
            params: {option: "get"},
            isArray: false
        }
    });
}]);

rssApp.service('rssFeeds', function(){

    var rssFeeds = ["http://forum.liga.net/rsslastds.asp", "https://www.reddit.com/r/gifs.rss", "http://news.liga.net/all/rss.xml"];

    this.addFeed = function(feed){
        rssFeeds.push(feed);
    };
    this.getAll = function(){
        return rssFeeds;
    };
    this.getFeed = function(id){
        return rssFeeds[id];
    };

});

rssApp.service('localService',['$window', function($window){

    var rssFeeds = ["http://forum.liga.net/rsslastds.asp", "https://www.reddit.com/r/gifs.rss", "http://news.liga.net/all/rss.xml"];
    $window.sessionStorage.setItem("rssFeeds",JSON.stringify(rssFeeds));
    this.addFeed = function(feed){
        var str;
        rssFeeds.push(feed);
        if ($window.sessionStorage.getItem("rssFeeds"))
        {
            $window.sessionStorage.removeItem("rssFeeds");
        }
        str = JSON.stringify(rssFeeds);
        $window.sessionStorage.setItem("rssFeeds", str);
    };
    this.getAllFeeds = function(){
        return rssFeeds;
    };
    this.getFeed = function(id){
        var rssArr = JSON.parse($window.sessionStorage.getItem("rssFeeds"));
        return rssArr[id];
    };

    this.setMessagesState = function(feed, messages){
        var obj, i;
        if($window.sessionStorage.getItem(feed)){
            obj = JSON.parse($window.sessionStorage.getItem(feed));
            for (i = 0; i < messages.length; i++){
                messages[i].read = obj[feed][i][1];
            }
            return messages;
        }else{
            var messagesState = [];
            for (i = 0; i < messages.length; i++){
                messagesState.push([messages[i].link, false]);
                messages[i].read = false;
            }
            obj = {};
            obj[feed] = messagesState;
            $window.sessionStorage.setItem(feed,JSON.stringify(obj));
            return messages;
        }
    };

    this.updateMessageStatus = function(feed, message){
        var obj = JSON.parse($window.sessionStorage.getItem(feed));
        for (var i = 0; i < obj[feed].length; i++){
            if(obj[feed][i][0] == message){
                obj[feed][i][1] = true;
            }
        }
        $window.sessionStorage.setItem(feed,JSON.stringify(obj));
    };

    this.clearMessagesState = function(feed){
        console.log('cleared feed:' + feed);
        $window.sessionStorage.removeItem(feed);
    }

}]);

rssApp.factory('local', ['$window', function($window){

        return {
            saveRss: function(rssFeeds) {
                var str;
                str = JSON.stringify(rssFeeds);
                if ($window.sessionStorage["rssFeeds"])
                {
                    $window.sessionStorage.removeItem("rssFeeds");
                }
                $window.sessionStorage["rssFeeds"] = str;
                return rssFeeds;
            },
            
            getRss: function(id) {

            },

            length: function(){
                return $window.sessionStorage.length;
            },

            getAll: function(){
                var arr = [];
                for (var item in $window.sessionStorage)
                {
                    arr.push(JSON.parse($window.sessionStorage[item]));
                }
                return arr;
            },
            
            quantity: function(){
                var quantity = 0;
                for (var item in $window.sessionStorage)
                {
                    var i = JSON.parse($window.sessionStorage[item]);
                    quantity += +i.quantity;
                }
                return quantity;
            },

            totalPrice: function(){
                var value = 0;
                for (var item in $window.sessionStorage)
                {
                    var temp = JSON.parse($window.sessionStorage[item]);
                    value += (+temp.price * +temp.quantity);
                }
                return value;
            },

            clear : function() {
                $window.sessionStorage.clear();
                $window.localStorage.clear();
                console.log('____________all clear___________');
            },

            deleteItem : function(id){
                for (var item in $window.sessionStorage)
                {
                   var temp = JSON.parse($window.sessionStorage[item]);
                   if( temp.id == id ){
                       $window.sessionStorage.removeItem(item);
                   }
                }
                return temp;
            }
        }
}]);
