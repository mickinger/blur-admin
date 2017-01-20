(function () {
  'use strict';

  angular.module('BlurAdmin.theme' )
  .service('databaseService', databaseService );

  /** @ngInject */
  function databaseService(baConfig ) {

    var  config =  window.myConfig;
    
/*
    var db = new PouchDB('localdb', {skip_setup: true});
    db.login('batman', 'brucewayne')
      .then(function (batman) {
         console.log("I'm Batman.");
         return db.logout();
       })
       .catch(function (error) {
        console.log( error );
       });
       
    //var db_ = new PouchDB('awdawdawdawd').plugin( 'pouchdb-authentication' );
    */
    
    return {
      config: config
    }
  }
  })();
