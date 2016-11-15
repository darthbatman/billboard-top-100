var billboard = require("../billboard-top-100.js").getChart;

billboard('hot-100', '1961-09-23', function(songs, err){
	if (err) console.log(err);
	console.log(songs);
});