(function () {
    angular.module('MetronicApp').controller('views.activity.modify',
        ['$scope', 'settings', '$uibModal', '$state', '$stateParams', 'dataFactory', 'appSession',
        function ($scope, settings, $uibModal, $state, $stateParams, dataFactory, appSession) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
         var aid = $stateParams.id;
      
            vm.activity = {};
            if (aid) {
                dataFactory.action("api/activity/detail", "", null, { id: aid })
                  .then(function (res) {
                      if (res.success) {
                          vm.activity = res.result;
                      } else {
                          abp.notify.error(res.error);
                      }
                  });
            } 
         
            vm.cancel = function () {
                $state.go("activity");
            }
            //保存
            vm.save = function () {
                if (!vm.plan.scene_type) {
                    abp.notify.warn("请选择场景");
                    return;
                }
                if (!vm.plan.game_id) {
                    abp.notify.warn("请选择游戏");
                    return;
                }
                if (vm.c.cardlist.length <= 0) {
                    abp.notify.warn("请选择卡券");
                    return;
                }
                vm.plan.cardList = vm.c.cardlist;
                if (vm.o.coll.length <= 0) {
                    abp.notify.warn("请选择组织");
                    return;
                }
                vm.plan.machineList = vm.o.coll;
                if (vm.t.select.length <= 0) {
                    abp.notify.warn("请选择提示信息");
                    return;
                }
                vm.plan.tipsList = vm.t.select;
                var url = "api/plan/updatePlan";
                dataFactory.action(url, "", null, vm.plan).then(function (res) {
                    if (res.result == "1") {
                        abp.notify.success("成功");
                        $state.go("activity");
                    } else {
                        abp.notify.error(res.errMsg);
                    }
                })
            }
        }]);
})();

