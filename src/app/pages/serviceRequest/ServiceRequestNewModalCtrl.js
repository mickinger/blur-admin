/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
   'use strict';

   angular.module('BlurAdmin.pages.serviceRequest')
      .controller('ServiceRequestNewModalCtrl', ServiceRequestNewModalCtrl);

   /** @ngInject */
   function ServiceRequestNewModalCtrl($scope, $uibModalInstance, databaseService ) {
     
      $scope.newItem =  databaseService.getRawDBmodel( '_SR' );
      console.log( $scope.newItem );
      $scope.link = '';
      $scope.ok = function () {
         $uibModalInstance.close($scope.newItem);
      };
   }

})();
