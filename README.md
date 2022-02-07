<h1 align="left">
  <img src="logo.png" width="64%" />
  <br />
</h1>

Node.js API to retrieve top songs, albums, and artists from Billboard's charts

![](https://github.com/darthbatman/billboard-top-100/actions/workflows/build.yml/badge.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/darthbatman/billboard-top-100)

## install

```bash
npm install billboard-top-100
```

## example

### getChart

```js
const { getChart } = require('billboard-top-100');

// date format YYYY-MM-DD
getChart('hot-100', '2016-08-27', (err, chart) => {
  if (err) console.log(err);
  // week of the chart in the date format YYYY-MM-DD
  console.log(chart.week);
  // URL of the previous week's chart
  console.log(chart.previousWeek.url);
  // date of the previous week's chart in the date format YYYY-MM-DD
  console.log(chart.previousWeek.date);
  // URL of the next week's chart
  console.log(chart.nextWeek.url);
  // date of the next week's chart in the date format YYYY-MM-DD
  console.log(chart.nextWeek.date);
  // array of top 100 songs for week of August 27, 2016
  console.log(chart.songs);
  // song with rank: 4 for week of August 27, 2016
  console.log(chart.songs[3]);
  // title of top song for week of August 27, 2016
  console.log(chart.songs[0].title);
  // artist of top songs for week of August 27, 2016
  console.log(chart.songs[0].artist);
  // rank of top song (1) for week of August 27, 2016
  console.log(chart.songs[0].rank);
  // URL for Billboard cover image of top song for week of August 27, 2016
  console.log(chart.songs[0].cover);
  // position info of top song
  console.log(chart.songs[0].position.positionLastWeek);
  console.log(chart.songs[0].position.peakPosition);
  console.log(chart.songs[0].position.weeksOnChart);
});

// chartName defaults to hot-100
// date defaults to Saturday of this week
getChart((err, chart) => {
  if (err) console.log(err);
  console.log(chart);
});

// date defaults to Saturday of this week
getChart('rock-digital-song-sales', (err, chart) => {
  if (err) console.log(err);
  console.log(chart);
});
```

### listCharts

```js
// list all charts
const { listCharts } = require('billboard-top-100');

listCharts((err, charts) => {
  if (err) console.log(err);
  // array of all charts
  console.log(charts);
});
```

## license

MIT © [Rishi Masand](https://github.com/darthbatman)
