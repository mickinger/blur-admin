(function () {
  'use strict';

  angular.module('BlurAdmin.theme' )
  .service('databaseService', databaseService );

  /** @ngInject */
  function databaseService(baConfig ) {

     var  config =  window.myConfig;


     //var db_ = new PouchDB( 'http://localhost:5984/mydb', {skipSetup: true});
     var db_ = new PouchDB('local_db');

     //local.sync(db, {live: true, retry: true}).on('error', console.log.bind(console));

     /* db.signup('batman3', 'brucewayne3', function (err, response) {
      if (err) {
      if (err.name === 'conflict') {
      console.log( "batman already exists, choose another username" );
      } else if (err.name === 'forbidden') {
      console.log( " invalid username" );
      } else {
      }
      }
      else {
      console.log(response)
      }
      });
      db.signup('robin', 'dickgrayson', {
      metadata : {
      email : 'robin@boywonder.com',
      birthday : '1932-03-27T00:00:00.000Z',
      likes : ['acrobatics', 'short pants', 'sidekickin\''],
      }
      }, function (err, response) {
      // etc.
      });*/
/*
     db_.login( config.user, config.passwd,  function (err, response) {
        if (err) {
           if (err.name === 'unauthorized') {
              console.log( "name or password incorrect" );
           } else {
              console.log( 'cosmic rays, a meteor, etc. ' );
           }
        }
        else {
           console.log( ' loggt in' );
        }
     });*/
     // var db_ = new PouchDB( 'http://localhost:5984/service_request', {auto_compaction: true} );
     var observerCallbacks = [];

     //call this when you know 'foo' has been changed
     var notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
           callback();
        });
     };

     var db_ = new PouchDB( 'localDB_2221' );
     var docs;
     var allShips = [];
     var allEntries = [];
     var dbref = 0;
     var statusObject_ = {
        priorities : {},
        vesselIds : {},
        categories : {},
        serviced: {},
        statuses: {},
        items: 0
     };

     //fetchInitialDocs();
     intiSync();

     var service = {
        dbref : dbref,
        config : config,
        registerObserverCallback : function(callback){
           observerCallbacks.push(callback);
        },
        getDatabase: function() {
           return db_;
        },
        getById : function( id ) {
           for (var i = 0; i < allEntries.length; i++) {
              if( allEntries[i].id == id ) {
                 return allEntries[i];
              }
           }
           return null;
        },
        putOrAdd : function( item ) {
           var dbModel = asDataBaseModel( item );
           db_.get( dbModel._id )
              .then(function(doc) {
                 db_.put(dbModel);
                 var updated = false;
                 for (var i = 0; i < allEntries.length; i++) {
                    if( allEntries[i].id == doc.id ) {
                       allEntries[i] = item;
                       updated = true;
                       dbchange();
                    }
                 }
                 if( !updated ) {
                    // realy ?? wh .. not in db.. error is nice !
                    allEntries.push( item );
                 }

              })
              .then(function(response) {


                 //fetchInitialDocs();
                 return true;
              })
              .catch(function (err) {

                 return false;
              });
        },
        add : function( item ) {

           db_.put(item)

              .then(function(response) {
                 allEntries.push( item );
                 dbchange();
                 //fetchInitialDocs();
                 return true;
              })
              .catch(function (err) {

                 return false;
              });
        },

        getRawDBmodel : function( idType ) {
           return getRawDBmodel( idType );
        },
        reloadAllSerices : function() {
           fetchInitialDocs();
           dbchange();
           return allEntries;
        },
        allSerices : function() {
           return allEntries;
        }

     };

     function dbchange() {

        dbref = dbref + 1;
        console.log( dbref );
        notifyObservers();
     }
     function intiSync() {
        var filter= function(doc){
           return doc.vesselId == config.id;
        }
        var externaldb_ = new PouchDB( 'http://localhost:5984/service_restest' );
        //var externaldb_ = new PouchDB( 'http://192.168.192.31:5984/service_request' );
        db_.sync( externaldb_,
           {
              live: true,
              retry: true
              //  filter: filter,
              //query_params: { vesselId: 894144 }
           }
        )
           .on('change', function (change) {
              //allEntries = [];
              fetchInitialDocs();
              console.log( 'sync cange' );
              //this.store.dispatch(this.serviceRequestActions.addServiceRequest(change));
           })
           .on('complete', function () {
              console.log( 'sync complete' );
              fetchInitialDocs();
           })
           .on('active', function () {
              console.log( 'sync active' );
           })
           .on('denied', function (err) {
              console.log( 'sync denied' );
           })
           .on('error', function (err) {
              console.log( err );
           });
        //info();
        fetchInitialDocs();
     }


     function asServiceModel( entry ) {
        //    console.log( entry );

        entry.date = createDateFromString(entry.date);
        entry.nextETA = createDateFromString(entry.nextETA);
        entry.plannedETA = createDateFromString(entry.plannedETA);
        //    console.log( entry );
        return entry;
     }

     function createDateFromString( dateString ) {
        if( dateString == null ) {
           return null;
        }
        return new Date( dateString );
     }
     function asDataBaseModel( entry ) {
        entry.date = aDateToString( entry.date );
        entry.nextETA = aDateToString( entry.nextETA );
        entry.plannedETA = aDateToString( entry.plannedETA );
        //  console.log( entry );
        return entry;
     }
     function getNextServiceId()  {
        var currentMax = 0;
        for (var i = 0; i < allEntries.length; i++) {
           var id = allEntries[i]._id;
           id = id.substring( id.lastIndexOf( "I" ) + 1, id.indexOf( "S" ) );
           var number = parseInt( id );
           if( number > currentMax ) {
              currentMax = number;
           }
        }
        console.log( pad( (currentMax + 1 ), 5 ) );
        return pad( (currentMax + 1 ), 5 );
     }
     function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
     }
     function getRawDBmodel( type )
     {
        var date = new Date();
        var id = getNextServiceId();
        var today = aDateToString( date );
        var prefix = 'D'+ date.getDay() + 'M' +  date.getMonth() + 'Y' + date.getYear();
        return {
           "_id": prefix + pad( config.id, 9 ) + 'I' + id + 'S' + pad( config.senderType, 2 )  + type,
           "id": id,
           "status": 0,
           "date": today,
           "priority": 0,
           "vesselId": config.id,
           "vesselName": config.name,
           "type": type,
           "actPort": "",
           "plannedPort": "",
           "plannedETA": null,
           "nextPort": "",
           "nextETA": null,
           "sender": config.user.id,
           "unit": 90,
           "nshort": "",
           "noffcomment": "",
           "ndesc": "",
           "nintern": "",
           "nextern": "",
           "canceld": false,
           "finished": false
        }
     }

     function aDateToString( date ) {
        if( date === '1970-01-01' || date === '' || date == null ) {
           return date;
        }
        return date;
        //return date.toISOString().substring(0, 10);
     }

     function fetchInitialDocs( status ) {
        allEntries = [];
        return db_.allDocs({include_docs: true}).then(function (res) {
           docs = res.rows.map(function (row) { return row.doc; });
           for (var i = 0; i < docs.length; i++) {
              allEntries.push( asServiceModel(docs[i]) );
           }
           console.log( 'done loading' );
           dbchange();
        });
     }
     return service;
     //  local.sync(db, {live: true, retry: true}).on('error', console.log.bind(console));

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


  }
  })();
