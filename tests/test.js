var billboard = require("../billboard-top-100.js").getChart;

billboard('hot-100', '2016-08-27', function(songs, err){
	if (err) console.log(err);
	console.log(songs);
});