angular.module('landing', [
    'ngRoute',
    'ngMessages'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })


    .config(function ($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: "about.tpl.html",
            controller: "GenaricPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/press', {
            templateUrl: "press.tpl.html",
            controller: "GenaricPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/team', {
            templateUrl: "team.tpl.html",
            controller: "GenaricPageCtrl"
        })
    })






    .config(function ($routeProvider) {
        $routeProvider.when('/page-not-found', {
            templateUrl: "page-not-found.tpl.html",
            controller: "PageNotFoundCtrl"
        })
    })

    .controller("PageNotFoundCtrl", function($scope){
        console.log("PageNotFound controller is running!")

    })
    .controller("GenaricPageCtrl", function($scope, $anchorScroll){
        console.log("GenaricPageCtrl controller is running!")


    })


    .controller("LandingPageCtrl", function ($scope) {

    })













