const { getChart } = require('../billboard-top-100.js');
const { listCharts } = require('../billboard-top-100.js');

getChart('hot-100', '2016-11-19', (err, chart) => {
  if (err) console.log(err);
  console.log(chart.week);
  console.log(chart.songs);
  console.log(chart.previousWeek);
  console.log(chart.nextWeek);
});

listCharts((err, charts) => {
  if (err) console.log(err);
  console.log(charts);
});
