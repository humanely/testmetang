import angular from 'angular';
import angularMeteor from 'angular-meteor';
//import uiRouter from 'angular-ui-router';
//import todosList from '../imports/components/todosList/todosList';
import headerList from '../imports/components/tpl/header';
import sidebarList from '../imports/components/tpl/sidebar';
import themePanel from '../imports/components/tpl/theme-panel';
import quickSidebar from '../imports/components/tpl/quick-sidebar';
import footer from '../imports/components/tpl/footer';

import dashboardUrl from  "../imports/components/views/dashboard.html"

import { Tasks } from '/imports/api/tasks';

var MetronicApp = angular.module('talkapp', [
	angularMeteor,
	//todosList.name,
	headerList.name,
	sidebarList.name,
	themePanel.name,
	quickSidebar.name,
	footer.name,
	"ui.router", 
	"ui.bootstrap", 
	"oc.lazyLoad",  
	"ngSanitize"
]);


/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);


/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/***
GLobal Directives
***/
// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
angular.module('talkapp').directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});









/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'compatibility/assets',
        globalPath: 'compatibility/assets/global',
        layoutPath: 'compatibility/assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

MetronicApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {
    
    $locationProvider.html5Mode({
	  enabled: true,
	  requireBase: true
	});

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");  
    
    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            dashboardUrl,            
            data: {pageTitle: 'Admin Dashboard'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'talkapp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'compatibility/assets/global/plugins/morris/morris.css',                            
                            'compatibility/assets/global/plugins/morris/morris.min.js',
                            'compatibility/assets/global/plugins/morris/raphael-min.js',                            
                            'compatibility/assets/global/plugins/jquery.sparkline.min.js',
                            'compatibility/assets/pages/scripts/dashboard.min.js',
                            'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })
		// AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '/assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '/assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '/assets/global/plugins/jstree/dist/jstree.min.js',
                            '/assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/assets/global/plugins/typeahead/typeahead.css',

                            '/assets/global/plugins/fuelux/js/spinner.min.js',
                            '/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/assets/global/plugins/typeahead/handlebars.min.js',
                            '/assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/clockface/css/clockface.css',
                            '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '/assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '/assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '/assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '/assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '/assets/global/plugins/clockface/js/clockface.js',
                            '/assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '/assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '/assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '/assets/global/plugins/select2/css/select2.min.css',
                            '/assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '/assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '/assets/global/plugins/select2/js/select2.full.min.js',

                            '/assets/pages/scripts/components-bootstrap-select.min.js',
                            '/assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                            '/assets/global/plugins/datatables/datatables.min.css', 
                            '/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '/assets/global/plugins/datatables/datatables.all.min.js',

                            '/assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/datatables/datatables.min.css', 
                            '/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '/assets/global/plugins/datatables/datatables.all.min.js',
                            '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '/assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/assets/pages/css/profile.css',
                            
                            '/assets/global/plugins/jquery.sparkline.min.js',
                            '/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '/assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '/assets/apps/css/todo-2.css',
                            '/assets/global/plugins/select2/css/select2.min.css',
                            '/assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '/assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '/assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })
}])


/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);



