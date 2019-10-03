const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

const BILLBOARD_BASE_URL = 'http://www.billboard.com';
const BILLBOARD_CHARTS_URL = `${BILLBOARD_BASE_URL}/charts/`;

/**
 * Enum for types of neighboring week.
 * @readonly
 * @enum {number}
 */
const NeighboringWeek = Object.freeze({
  Previous: 1,
  Next: 2,
});



/**
 * Gets the title from the specified chart item
 *
 * @param {HTMLElement} chartItem - The chart item
 * @return {string} The title
 *
 * @example
 *
 *     getTitleFromChartItem(<div class="chart-list-item">...</div>) // 'The Real Slim Shady'
 */
function getTitleFromChartItem(chartItem, $) {
  let title;
  try {
    title = $('.chart-element__information__song', chartItem).text()
  } catch (e) {
    title = '';
  }
  return title.trim();
}

/**
 * Gets the artist from the specified chart item
 *
 * @param {HTMLElement} chartItem - The chart item
 * @return {string} The artist
 *
 * @example
 *
 *     getArtistFromChartItem(<div class="chart-list-item">...</div>) // 'Eminem'
 */
function getArtistFromChartItem(chartItem, $) {
  let artist;
  try { 
    artist = $('.chart-element__information__artist', chartItem).text()    
  } catch (e) {
    artist = '';
  }
  
  return artist.trim();
}

/**
 * Gets the cover from the specified chart item
 *
 * @param {HTMLElement} chartItem - The chart item
 * @param {number} rank - The rank of the chart item
 * @return {string} The cover url string
 *
 * @example
 *
 *     getCoverFromChartItem(<div class="chart-list-item">...</div>) // 'https://charts-static.billboard.com/img/2016/12/locash-53x53.jpg'
 */
function getCoverFromChartItem(chartItem, $) {
  let cover;

  try {
    cover = $('.chart-element__image', chartItem).css('background-image').substr(5);
    cover = cover.substr(0, cover.length-2)   
  } catch (e) {
    cover = '';
  }
  return cover.trim();
}

/**
 * Gets the position last week from the specified chart item
 *
 * @param {HTMLElement} chartItem - The chart item
 * @return {number} The position last week
 *
 * @example
 *
 *     getPositionLastWeekFromChartItem(<div class="chart-list-item">...</div>) // 4
 */
function getPositionLastWeekFromChartItem(chartItem, $) {
  let positionLastWeek;
  try {
    positionLastWeek = $('.chart-element__meta.text--last', chartItem).text()
  } catch (e) {
    positionLastWeek = '';
  }
  return parseInt(positionLastWeek, 10);
}

/**
 * Gets the peak position from the specified chart item
 *
 * @param {HTMLElement} chartItem - The chart item
 * @return {number} The peak position
 *
 * @example
 *
 *     getPeakPositionFromChartItem(<div class="chart-list-item">...</div>) // 4
 */
function getPeakPositionFromChartItem(chartItem, $) {
  let peakPosition;
  try {
    peakPosition = $('.chart-element__meta.text--peak', chartItem).text()
  } catch (e) {
    peakPosition = '';
  }
  return parseInt(peakPosition, 10);
}

/**
 * Gets the weeks on chart last week from the specified chart item
 *
 * @param {HTMLElement} chartItem - The chart item
 * @return {number} The weeks on chart
 *
 * @example
 *
 *     getWeeksOnChartFromChartItem(<div class="chart-list-item">...</div>) // 4
 */
function getWeeksOnChartFromChartItem(chartItem, $) {
  let weeksOnChart;
  try {
    weeksOnChart = $('.chart-element__meta.text--week', chartItem).text()
  } catch (e) {
    weeksOnChart = '1';
  }
  return parseInt(weeksOnChart, 10);
}

/**
 * Gets information for specified chart and date
 *
 * @param {string} chartName - The specified chart
 * @param {string} date - Date represented as string in format 'YYYY-MM-DD'
 * @param {function} cb - The specified callback method
 *
 * @example
 *
 *     getChart('hot-100', '2016-08-27', function(err, chart) {...})
 */
function getChart(name, date, cb) {
  let chartName = name;
  let chartDate = date;
  let callback = cb;
  // check if name was specified
  if (typeof name === 'function') {
    // if name not specified, default to hot-100 chart for current week,
    // and set callback method accordingly
    callback = name;
    chartName = 'hot-100';
    chartDate = '';
  }
  // check if date was specified
  if (typeof date === 'function') {
    // if date not specified, default to specified chart for current week,
    // and set callback method accordingly
    callback = date;
    chartDate = '';
  }
  const chart = {};
  /**
   * A song
   * @typedef {Object} Song
   * @property {string} title - The title of the song
   * @property {string} artist - The song's artist
   */

  /**
   * Array of songs
   */
  chart.songs = [];
  // build request URL string for specified chart and date
  const requestURL = `${BILLBOARD_CHARTS_URL}${chartName}/${chartDate}`;
  request(requestURL, (error, response, html) => {
    if (error) {
      callback(error, null);
      return;
    }

    const $ = cheerio.load(html);
    // get chart week
    const date = moment(new Date($('.date-selector__button').text().trim()));
    chart.week = date.format('YYYY-MM-DD');
    
    
    // yyyymmddDateFromMonthDayYearDate($('.chart-detail-header__date-selector-button')[0].children[0].data.replace(/\n/g, ''));
    // // get previous and next charts
    const prevWeek = date.subtract(7, 'days').format('YYYY-MM-DD')
    chart.previousWeek = {
      date: prevWeek,
      url: `${BILLBOARD_CHARTS_URL}${chartName}/${prevWeek}`
    };

    const nextWeek = date.add(14, 'days').format('YYYY-MM-DD');
    chart.nextWeek = {
      date: nextWeek, 
      url: `${BILLBOARD_CHARTS_URL}${chartName}/${nextWeek}`
    };

    // push remaining ranked songs into chart.songs array
    $('.chart-list__element').each((index, item) => {
      const rank = index + 1;
      
      chart.songs.push({
        rank,
        title: getTitleFromChartItem(item, $),
        artist: getArtistFromChartItem(item, $),
        cover: getCoverFromChartItem(item, $),
        position: {
          positionLastWeek: getPositionLastWeekFromChartItem(item, $),
          peakPosition: getPeakPositionFromChartItem(item, $),
          weeksOnChart: getWeeksOnChartFromChartItem(item, $),
        },
      });
    });
    // callback with chart if chart.songs array was populated
    if (chart.songs.length > 1) {
      callback(null, chart);
    } else {
      callback('Songs not found.', null);
    }
  });
}

/**
 * Gets all charts available via Billboard
 *
 * @param {string} chart - The specified chart
 * @param {string} date - Date represented as string in format 'YYYY-MM-DD'
 * @param {function} cb - The specified callback method
 *
 * @example
 *
 *     listCharts(function(err, charts) {...})
 */
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
    /**
     * A chart
     * @typedef {Object} Chart
     * @property {string} name - The name of the chart
     * @property {string} url - The url of the chat
     */

    /**
     * Array of charts
     */
    const charts = [];
    // push charts into charts array
    $('.chart-panel__link').each((_, item) => {
      const chart = {};
      chart.name = item.children[1].children[1].children[0].data.trim();
      chart.url = `${BILLBOARD_BASE_URL}${item.attribs.href}`;
      charts.push(chart);
    });
    // callback with charts if charts array was populated
    if (charts.length > 0) {
      cb(null, charts);
    } else {
      cb('No charts found.', null);
    }
  });
}

// export getChart and listCharts functions
module.exports = {
  getChart,
  listCharts,
};
