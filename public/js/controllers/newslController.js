angular.module('talkapp').controller('newslController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        //alert(3)
    });
    var svg = d3.select("#swimChart")

    // set sidebar closed and body solid layout mode
   $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});