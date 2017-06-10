/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",//路由
    "ui.bootstrap",//样式
    "oc.lazyLoad",//懒加载
    "ngSanitize",//初始化
      'objectTable',//table表格
    'objPagination',//分页
    'angularFileUpload',//文件上传
    'abp', 'ngLocale',
    "isteven-multi-select",//下拉标签
    , "textAngular"
]);

//懒加载
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//控制器全局设置
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);
MetronicApp.factory('appSession', [
          function () {
              var _session = null;
              var cookie = $.cookie("eggsResult");
              if (cookie != "" && cookie != undefined) {
                  var temp = $.parseJSON(cookie);
                  _session = temp;
              }
              else {
                  window.location.href = "/index.html";
              }
              return _session;
          }
]);
//全局工厂设置
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: false, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout',
    };
    $rootScope.settings = settings;

    return settings;
}]);

//app控制器
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', "appSession", function ($scope, appSession) {
    if (!appSession) {
        window.location.href = "index.html";
    }
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
    vm = this;
    vm.user = appSession;
    vm.out = function () {
        $.cookie("eggsResult", null, { path: "/" });
        location.href = "index.html";
    }
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    var vm = this;

    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
    vm.list = [
      { url: "activity", title: "活动管理", icon: "fa fa-clipboard" },
      //{
      //    url: "", title: "方案管理", icon: "fa fa-suitcase", child: [
      //         { url: "plan", title: "方案列表", icon: "fa fa-sticky-note" },
      //         { url: "record", title: "领取记录", icon: "fa fa-bars" },
      //    ]
      //},
      { url: "gift", title: "礼物管理", icon: "fa fa-cogs" },
      { url: "prize", title: "奖品管理", icon: "fa fa-cogs" },
    ];

}]);
/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

//路由设置
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/activity.html");
    var abp = abp;
    $stateProvider
        //活动管理
        .state("activity", {
            url: "/activity.html",
            templateUrl: "views/activity/index.html",
            data: { pageTitle: '活动管理' },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [{
                            name: 'QiNiu',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'assets/global/plugins/plupload/angular-local-storage.js',
                                'assets/global/plugins/plupload/qupload.js',
                            ]
                        },
                        {
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'views/activity/index.js'
                            ]
                        }]

                        );
                }]
            }
        })
         //方案管理

        //添加方案
       .state("modify", {
           url: "/modify.html",
           params: { "id": null },
           templateUrl: "views/activity/modify.html",
           data: { pageTitle: '管理活动' },
           resolve: {
               deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                   return $ocLazyLoad.load(

                       [{
                           name: 'QiNiu',
                           insertBefore: '#ng_load_plugins_before',
                           files: [
                               'assets/global/plugins/plupload/angular-local-storage.js',
                               'assets/global/plugins/plupload/qupload.js',
                           ]
                       }, 
                        {
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'views/activity/modify.js',
                            ]
                        }]

                     );
               }]
           }
       })
      //礼物方案
       .state("gift", {
           url: "/gift.html",
           templateUrl: "views/gift/index.html",
           data: { pageTitle: '礼物管理' },
           resolve: {
               deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                   return $ocLazyLoad.load([{
                       name: 'QiNiu',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'assets/global/plugins/plupload/angular-local-storage.js',
                           'assets/global/plugins/plupload/qupload.js',
                       ]
                   }, {
                       name: 'Modal',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'views/gift/modal.js'
                       ]
                   },
                        {
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'views/gift/index.js'
                            ]
                        }]
);
               }]
           }
       })
       //奖品方案
       .state("prize", {
           url: "/prize.html",
           templateUrl: "views/prize/index.html",
           data: { pageTitle: '奖品管理' },
           resolve: {
               deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                   return $ocLazyLoad.load([{
                       name: 'QiNiu',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'assets/global/plugins/plupload/angular-local-storage.js',
                           'assets/global/plugins/plupload/qupload.js',
                       ]
                   }, {
                       name: 'Modal',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'views/prize/modal.js'
                       ]
                   },
                        {
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'views/prize/index.js'
                            ]
                        }]
);
               }]
           }
       })
        //参与者管理
       .state("actor", {
           url: "/actor.html",
           params: { "id": null },
           templateUrl: "views/actor/index.html",
           data: { pageTitle: '奖品管理' },
           resolve: {
               deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                   return $ocLazyLoad.load([{
                       name: 'QiNiu',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'assets/global/plugins/plupload/angular-local-storage.js',
                           'assets/global/plugins/plupload/qupload.js',
                       ]
                   }, {
                       name: 'Modal',
                       insertBefore: '#ng_load_plugins_before',
                       files: [
                           'views/actor/modal.js'
                       ]
                   },
                        {
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'views/actor/index.js'
                            ]
                        }]
);
               }]
           }
       })
}]);

//启动
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

}]);