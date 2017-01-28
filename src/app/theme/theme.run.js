/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .run(themeRun);

  /** @ngInject */
  function themeRun($timeout, $rootScope, layoutPaths, preloader, $q, baSidebarService, themeLayoutSettings, databaseService, toastr ) {
    var whatToWait = [
      preloader.loadAmCharts(),
      //databaseService.intiSync(),
      $timeout(3000)
    ];

    //console.log( databaseService.getRawDBmodel( '_SR') );
/*
    databaseService.getDatabase().get( 'D1M0Y117000456789I00002S01_SR' , {
        revs: true,
        open_revs: 'all' // this allows me to also get the removed "docs"
      } ).then(function(found) {
        console.log(found);
      });
    */
      databaseService.getDatabase().changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', function (change) {
        // change.id contains the doc id, change.doc contains the doc
        if (change.deleted) {
          // document was deleted
        } else {
          toastr.info( change.doc.nshort, change.doc.vesselName + " changed"  , {
            "autoDismiss": true,
            "positionClass": "toast-top-right",
            "type": "info",
            "timeOut": "15000",
            "extendedTimeOut": "2000",
            "allowHtml": false,
            "closeButton": true,
            "tapToDismiss": true,
            "progressBar": true,
            "newestOnTop": true,
            "maxOpened": 0,
            "preventDuplicates": false,
            "preventOpenDuplicates": false
          })
        }
      }).on('error', function (err) {
        // handle errors
      });
    
    //databaseService.add ( databaseService.getRawDBmodel( '_SR' ) );
    var theme = themeLayoutSettings;
    if (theme.blur) {
      if (theme.mobile) {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-mobile.jpg'));
      } else {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg.jpg'));
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-blurred.jpg'));
      }
    }

    $q.all(whatToWait).then(function () {
      $rootScope.$pageFinishedLoading = true;
    });

    $timeout(function () {
      if (!$rootScope.$pageFinishedLoading) {
        $rootScope.$pageFinishedLoading = true;
      }
    }, 7000);

    $rootScope.$baSidebarService = baSidebarService;

  }

})();
