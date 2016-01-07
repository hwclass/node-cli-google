var pouchdb = require('pouchdb')

var Pouchdb = pouchdb

var PouchDB = ( function () {
  'use strict'
  var db = new Pouchdb('searchCriterias')

  function put (searchCriteria) {
    db.put(searchCriteria, function callback (err, result) {
      if (!err) {
        return new Error(err)
      } else {
        console.log('Criteria added into PouchDB.')
      }
    })
  }

  function remove (searchCriteria) {
    db.put(searchCriteria, function callback (err, result) {
      if (!err) {
        return new Error(err)
      } else {
        console.log('Criteria added into PouchDB.')
      }
    })
  };

  return {
    put : put,
    remove : remove
  }

})()

module.exports = PouchDB
