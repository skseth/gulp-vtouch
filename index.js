'use strict';
var fs = require('fs');
var path = require('path');
var through = require('through2');
var gs = require("glob-stream");
var Q = require('kew');

function getLatestDependentTime(glob, opts, latestTimeDeferred) {
  var latestTime = 0

  gs.create(glob, opts)
    .on('data', function (file) {
      var curTime = fs.statSync(file.path).mtime
      if (curTime > latestTime) {
        latestTime = curTime
      }
    })
    .on('end', function() {
      latestTimeDeferred.resolve(latestTime)
    })

}

module.exports = function (depglob, opts) {
  opts = opts || {};
  opts.nosort = true;

  var latestTimeDeferred = Q.defer()

  getLatestDependentTime(depglob, opts, latestTimeDeferred)

  return through.obj(function (file, enc, cb) {
    function modifyFileTimeIfEarlier(latestTime) {
      if (file.stat.mtime < latestTime) {
        file.stat.mtime = latestTime;
      }

      cb(null, file);
    }

    latestTimeDeferred.promise
      .then(modifyFileTimeIfEarlier);
  });
};

