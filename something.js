const { getChart } = require('./billboard-top-100.js');

getChart('hot-100', '2005-04-03', (err, chart) => {
	if (err) console.log(err);
	console.log(chart);
})
