var billboard = require("../billboard-top-100.js").getChart;
var listCharts = require("../billboard-top-100.js").listCharts;

listCharts(function(data){
	console.log(data);
});

billboard('hot-100', '2016-11-19', function(songs, err){
	if (err) console.log(err);
	console.log(songs);
});