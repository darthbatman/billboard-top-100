/*
Name:         searchitunes
Description:  Search the Apple iTunes Store and App Store.
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-searchitunes
Feedback:     https://github.com/fvdm/nodejs-searchitunes/issues
API docs:     http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html
License:      Unlicense / Public Domain, see UNLICENSE file
              (https://github.com/fvdm/nodejs-searchitunes/raw/master/UNLICENSE)
*/

var http = require ('httpreq');

module.exports = function (params, timeout, callback) {
  if (typeof timeout === 'function') {
    callback = timeout;
    timeout = 5000;
  }

  if (!params || !(params instanceof Object)) {
    callback (new Error ('invalid params'));
    return;
  }

  params.version = params.version || 2;

  http.get (
    'https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/wsSearch',
    {
      parameters: params,
      timeout: timeout,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'searchitunes.js'
      }
    },
    function (err, res) {
      var error = null;
      var data;

      if (err) {
        error = new Error ('http error');
        error.code = res.statusCode;
        error.body = res.body;
        callback (error);
        return;
      }

      try {
        data = JSON.parse (res.body);

        if (!(data.results instanceof Array) || !data.results.length) {
          callback (new Error ('no results'));
          return;
        }

        callback (null, data);
      } catch (e) {
        error = new Error ('invalid response');
        error.error = e;
        callback (error);
      }
    }
  );
};
