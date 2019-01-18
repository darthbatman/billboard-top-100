var getChart = require("../billboard-top-100.js").getChart;
var listCharts = require("../billboard-top-100.js").listCharts;

getChart('hot-100', '2016-11-19', function(err, chart){
    if (err) console.log(err);
    console.log(chart.week);
	console.log(chart.songs);
});

listCharts(function(err, data){
    console.log(data);
});
