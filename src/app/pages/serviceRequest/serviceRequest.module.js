/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
   'use strict';

   angular.module('BlurAdmin.pages.serviceRequest', [])
      .config(routeConfig);

   /** @ngInject */
   function routeConfig($stateProvider) {
      $stateProvider
         .state('serviceRequest', {
            url: '/serviceRequest',
            title: 'Service Request',
            templateUrl: 'app/pages/serviceRequest/serviceRequests.html',
            controller: 'ServiceRequestPageCtrl',
            sidebarMeta: {
               order: 800,
            }
         });
   }

})();