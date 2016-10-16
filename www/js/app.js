// Ionic ioRant app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'devrant' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'devrant.services' is found in services.js
// 'devrant.controllers' is found in controllers.js
angular.module('devrant', ['ionic', 'ionic-material', 'ionic-toast', 'devrant.controllers', 'devrant.services', 'ngStorage'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('feed', {
        url: '/feed',
        templateUrl: 'templates/feed.html',
        controller: 'FeedController'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('rant', {
        url: '/rants/:id',
        templateUrl: 'templates/rant.html',
        controller: 'RantController'
    })
    .state('about', {
        url: '/about',
        templateUrl: 'templates/about.html'
    })
    ;
    $urlRouterProvider.otherwise('/feed');
})
