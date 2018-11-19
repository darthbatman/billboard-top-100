var billboard = require("../billboard-top-100.js").getChart;
var listCharts = require("../billboard-top-100.js").listCharts;

listCharts(function(err, data){
    console.log(data);
});

billboard('hot-100', '2016-11-19', function(err, songs){
    if (err) console.log(err);
    console.log(songs);
});
