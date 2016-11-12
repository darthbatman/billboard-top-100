var billboard = require("../billboard-top-100.js").getChart;

billboard('greatest-adult-pop-artists', '2016-08-27', function(songs){
	console.log(songs);
});