﻿(function () {
    angular.module('MetronicApp').controller('views.activity.index', ['$scope', "$state", 'settings', "dataFactory", 'appSession',
        function ($scope, $state, settings, dataFactory, appSession) {
            // ajax初始化
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            var vm = this;
            vm.filter = { index:1,size:10,filter:"" };
      
            //页面属性
            vm.table = {
                data: [],               //数据集
                checkModel: {},         //选择的集合
                filter: "",//条件搜索
                pageConfig: {           //分页配置
                    currentPage: 1,//当前页
                    itemsPerPage: 10,//页容量
                    totalItems: 0//总数据
                }
            }
            //获取用户数据集，并且添加配置项
            vm.init = function () {
                vm.table.checkModel = {};
                vm.filter.index = vm.table.pageConfig.currentPage;
                vm.filter.size = vm.table.pageConfig.itemsPerPage;
                dataFactory.action("api/activity/activitys", "", null, vm.filter)
                    .then(function (res) {
                        if (res.success) {
                            vm.table.pageConfig.totalItems = res.result.total;
                            vm.table.data = res.result.data;
                            vm.table.pageConfig.onChange = function () {
                                vm.init();
                            }
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            };
            vm.init();
            vm.add = function () {
                $state.go("modify");
            }
            vm.edit = function () {
                var id = Object.getOwnPropertyNames(vm.table.checkModel);
                if (id.length != 1) {
                    abp.notify.warn("请选择一个操作对象");
                    return;
                }
                $state.go("modify", { id: id[0] });
            }

            vm.delete = function () {
                var ids = Object.getOwnPropertyNames(vm.table.checkModel);
                if (ids.length != 1) {
                    abp.notify.warn("请选择一个操作对象");
                    return;
                }
                var temp = vm.table.checkModel[ids[0]];
                abp.message.confirm(
               '删除将导致数据无法显示', //确认提示
               '确定要删除么?',//确认提示（可选参数）
               function (isConfirmed) {
                   if (isConfirmed) {
                       dataFactory.action("api/card/delete?card_id="+temp.card_id, "", null, {  }).then(function (res) {
                           abp.notify.success("删除成功");
                           vm.init();
                       });
                   }
                   });

            }
      
        }])
})();
