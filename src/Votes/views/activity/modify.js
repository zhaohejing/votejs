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
         vm.date = {
             leftopen: false,
             rightopen: false,
             inlineOptions: {
                 showWeeks: false
             },
             dateOptions: {
                 //dateDisabled: disabled,
                 formatYear: 'yyyy',
                 formatMonth: 'MM',
                 formatDay: 'dd',
                 maxDate: new Date(5000, 1, 1),
                 minDate: new Date(1900, 1, 1),
                 startingDay: 1
             },
             openleft: function () {
                 vm.date.leftopen = !vm.date.leftopen;
             },
             openright: function () {
                 vm.date.rightopen = !vm.date.rightopen;
             }
         }
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
                if (vm.file.show.length<=0) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                vm.activity.images = vm.file.show;
                var url = "api/activity/modify";
                dataFactory.action(url, "", null, vm.activity).then(function (res) {
                    if (res.result == "1") {
                        abp.notify.success("成功");
                        $state.go("activity");
                    } else {
                        abp.notify.error(res.errMsg);
                    }
                })
            }

            vm.file = {
                multiple: false,
                token: "",
                init: function () {
                    dataFactory.action("api/token/qnToken", "", null, {}).then(function (res) {
                        if (res.result == "1") {
                            vm.file.token = res.data;
                        }
                    })
                },
                uploadstate: false,
                show: [],
                selectFiles: [],
                start: function (index) {
                    vm.file.selectFiles[index].progress = {
                        p: 0
                    };
                    vm.file.selectFiles[index].upload = $qupload.upload({
                        key: '',
                        file: vm.file.selectFiles[index].file,
                        token: vm.file.token
                    });
                    vm.file.selectFiles[index].upload.then(function (response) {
                        var dto = { title: vm.file.selectFiles[index].file.name, url: "http://7niu.efanyun.com/" + response.key };
                        vm.file.show.push(dto);
                        vm.file.uploadstate = true;
                    }, function (response) {
                        abp.notify.error("上传失败,请重试");
                    }, function (evt) {
                        // progress
                        vm.file.selectFiles[index].progress.p = Math.floor(100 * evt.loaded / evt.totalSize);
                    });
                },
                abort: function () {
                    //  vm.model.address = response.address;
                    vm.file.show = [];
                    vm.selectFiles = [];
                },
                onFileSelect: function ($files) {
                    vm.file.selectFiles = [];
                    var offsetx = vm.file.selectFiles.length;
                    for (var i = 0; i < $files.length; i++) {
                        vm.file.selectFiles[i + offsetx] = {
                            file: $files[i]
                        };
                        vm.file.start(i + offsetx);
                    }
                }
            }
            vm.file.init();
        }]);
})();

