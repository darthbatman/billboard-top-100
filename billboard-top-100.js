const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

const BILLBOARD_BASE_URL = 'http://www.billboard.com';
const BILLBOARD_CHARTS_URL = `${BILLBOARD_BASE_URL}/charts/`;

function getChart(name, date, cb) {
  let chartName = name;
  let chartDate = date;
  let callback = cb;

  if (typeof name === 'function') {
    // if name not specified, default to hot-100 chart for current week,
    // and set callback method accordingly
    callback = name;
    chartName = 'hot-100';
    chartDate = '';
  }

  if (typeof date === 'function') {
    // if date not specified, default to specified chart for current week,
    // and set callback method accordingly
    callback = date;
    chartDate = '';
  }

  const chart = {};
  chart.songs = [];

  const requestURL = `${BILLBOARD_CHARTS_URL}${chartName}/${chartDate}`;
  request(requestURL, (error, response, html) => {
    if (error) {
      callback(error, null);
      return;
    }

    const $ = cheerio.load(html);

    const d = moment(new Date($('.chart-results')[0].children[1].children[1].children[3].children[0].data.trim().slice('Week of '.length)));
    chart.week = d.format('YYYY-MM-DD');

    const prevWeek = d.subtract(7, 'days').format('YYYY-MM-DD');
    chart.previousWeek = {
      date: prevWeek,
      url: `${BILLBOARD_CHARTS_URL}${chartName}/${prevWeek}`,
    };

    const nextWeek = d.add(14, 'days').format('YYYY-MM-DD');
    chart.nextWeek = {
      date: nextWeek,
      url: `${BILLBOARD_CHARTS_URL}${chartName}/${nextWeek}`,
    };

    const chartListItems = $('.o-chart-results-list-row-container');
    for (let i = 0; i < chartListItems.length; i += 1) {
      chart.songs.push({
        rank: parseInt(chartListItems[i].children[1].children[1].children[1].children[0].data.trim(), 10),
        title: chartListItems[i].children[1].children[7].children[1].children[1].children[1].children[0].data.trim(),
        artist: chartListItems[i].children[1].children[7].children[1].children[1].children[3].children[0].data.trim(),
        cover: chartListItems[i].children[1].children[3].children[1].children[1].children[1].attribs['data-lazy-src'],
        position: {
          positionLastWeek: parseInt(chartListItems[i].children[1].children[7].children[1].children[7].children[1].children[0].data.trim(), 10),
          peakPosition: parseInt(chartListItems[i].children[1].children[7].children[1].children[9].children[1].children[0].data.trim(), 10),
          weeksOnChart: parseInt(chartListItems[i].children[1].children[7].children[1].children[11].children[1].children[0].data.trim(), 10),
        },
      });
    }

    if (chart.songs.length > 1) {
      callback(null, chart);
    } else {
      callback('Songs not found.', null);
    }
  });
}

const getChartsFromCategory = async (categoryURLs, cb) => {
  const charts = [];
  let a = 0;
  for (let j = 0; j < categoryURLs.length; j += 1) {
    const categoryURL = categoryURLs[j];
    request(categoryURL, (error, response, html) => {
      if (error) {
        a += 1;
      } else {
        const $ = cheerio.load(JSON.parse(html).html);

        const chartLinks = $('a.lrv-u-flex.lrv-u-flex-direction-column');
        for (let i = 0; i < chartLinks.length; i += 1) {
          if (chartLinks[i].attribs.href.startsWith('/charts/')) {
            charts.push({ name: chartLinks[i].children[1].children[0].data.trim(), url: `${BILLBOARD_BASE_URL}${chartLinks[i].attribs.href}` });
          }
        }
        a += 1;
      }
      if (a === categoryURLs.length) {
        cb(charts);
      }
    });
  }
};

function listCharts(cb) {
  if (typeof cb !== 'function') {
    cb('Specified callback is not a function.', null);
    return;
  }
  request(BILLBOARD_CHARTS_URL, (error, response, html) => {
    if (error) {
      cb(error, null);
      return;
    }
    const $ = cheerio.load(html);

    const chartCategories = $('.o-nav__list-item.lrv-u-color-grey-medium-dark');
    const chartCategoryURLs = [];
    for (let i = 0; i < chartCategories.length; i += 1) {
      if (chartCategories[i].children[1].attribs.href === '#') {
        chartCategoryURLs.push(`https://www.billboard.com/pmc-ajax/charts-fetch-all-chart/selected_category-${encodeURIComponent(chartCategories[i].children[1].attribs.rel)}/chart_type-weekly/`);
      }
    }
    getChartsFromCategory(chartCategoryURLs, (charts) => {
      if (charts.length > 0) {
        cb(null, charts);
      } else {
        cb('No charts found.', null);
      }
    });
  });
}

module.exports = {
  getChart,
  listCharts,
};
