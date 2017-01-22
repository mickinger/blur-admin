/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.serviceRequest')
    .controller('ServiceRequestPageCtrl', ServiceRequestPageCtrl);

  /** @ngInject */
  function ServiceRequestPageCtrl($scope, fileReader, $filter, $uibModal, databaseService) {

    var updateList = function(){
      console.log( 'exceuted' );
      $scope.list = databaseService.allSerices();
      $scope.$apply();
    };
    databaseService.registerObserverCallback(updateList);
    $scope.list = databaseService.allSerices();

    $scope.showModal = function (item) {
      $uibModal.open({
        animation: false,
        controller: 'ServiceRequestModalCtrl',
        templateUrl: 'app/pages/serviceRequest/serviceRequestsModal.html'
      }).result.then(function (link) {
          item.href = link;
        });
    };

    $scope.switches = [true, true, false, true, true, false];
  }

})();
