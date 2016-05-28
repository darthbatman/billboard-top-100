// Load module
var itunes = require ('searchitunes');

// Search parameters
var params = {
  entity: 'software',
  country: 'NL',
  term: 'github',
  limit: 1,
  price: 0
};

// Fancy console.log
function output (err, data) {
  console.dir (err || data, {
    depth: null,
    colors: true
  });
}

// Do the search
itunes (params, output);
