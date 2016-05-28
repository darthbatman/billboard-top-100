/*
Name:         openkvk - test.js
Description:  Test script for openkvk.js
Source:       https://github.com/fvdm/nodejs-openkvk
Feedback:     https://github.com/fvdm/nodejs-openkvk/issues
License:      Public Domain / Unlicense (see LICENSE file)
*/

var dotest = require ('dotest');
var app = require ('./');

// Setup
var timeout = process.env.testTimeout || 5000;


// Tests
dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .done ();
});


dotest.add ('Error: invalid params', function (test) {
  app (null, function (err) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'invalid params')
      .done ();
  });
});


dotest.add ('Error: no results', function (test) {
  var params = {
    entity: 'software',
    country: 'NL',
    term: null,
    limit: 1,
    price: 0
  };

  app (params, timeout, function (err) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'no results')
      .done ();
  });
});


dotest.add ('Search', function (test) {
  var params = {
    entity: 'software',
    country: 'NL',
    term: 'github',
    limit: 1,
    price: 0
  };

  app (params, timeout, function (err, data) {
    var item = data && data.results && data.results [0];

    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('fail', 'data.resultCount', data && data.resultCount, 1)
      .isArray ('fail', 'data.results', data && data.results)
      .isNotEmpty ('fail', 'data.results', data && data.results)
      .isObject ('fail', 'data.results[0]', item)
      .isExactly ('fail', 'data.results[0].kind', item && item.kind, 'software')
      .done ();
  });
});


// Start the tests
dotest.run ();
