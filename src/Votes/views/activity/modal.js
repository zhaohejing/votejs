angular.module('MetronicApp').controller('views.activity.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory', '$qupload',
        function ($scope, settings, $uibModalInstance, model, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.input= { activityId: model.activityId }
            vm.url = "api/actor/mutileactors";
            vm.save = function () {
                if (!vm.input.activityId || vm.input.activityId <= 0) {
                    abp.notify.warn("活动不存在");
                    return;
                }
                if (vm.file.show.length<=0) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                vm.input.actors = vm.file.show;
                dataFactory.action(vm.url, "", null, vm.input).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error("保存失败,请重试");
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        
            vm.file = {
                multiple: true,
                token: "",
                init: function () {
                    dataFactory.action("api/token/qnToken", "", null, {})
                        .then(function(res) {
                            if (res.result == "1") {
                                vm.file.token = res.data;
                            }
                        });
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
                        var name = vm.file.selectFiles[index].file.name;
                        var dto = {
                            actorKey:new Date().valueOf(),
                            actorName: name.split('.')[0] ,
                            actorImage: "http://image.leftins.com/" + response.key
                        };
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
                    vm.file.selectFiles = [];
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
