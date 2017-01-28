/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.serviceRequest')
    .controller('ServiceRequestPageCtrl', ServiceRequestPageCtrl);

  /** @ngInject */
  function ServiceRequestPageCtrl($scope, fileReader, $filter, $uibModal, databaseService, editableOptions, editableThemes) {

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
    
    $scope.showNewModal = function () {
      //$scope.item = databaseService.getRawDBmodel( '_SR' );
      //console.log( $scope.item );
      $uibModal.open({
        animation: false,
        controller: 'ServiceRequestNewModalCtrl',
        templateUrl: 'app/pages/serviceRequest/edit/serviceRequestsNewModal.html'
      }).result.then(function (item) {
          databaseService.add( item );
        });
    };

    $scope.switches = [true, true, false, true, true, false];
  }

})();
