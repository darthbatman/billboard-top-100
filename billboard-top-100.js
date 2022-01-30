const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

const BILLBOARD_BASE_URL = 'http://www.billboard.com';
const BILLBOARD_CHARTS_URL = `${BILLBOARD_BASE_URL}/charts/`;
const BILLBOARD_IMAGE_URL = 'https://charts-static.billboard.com';
const BILLBOARD_ASSET_URL = 'https://assets.billboard.com';
const BILLBOARD_BB_PLACEHOLDER = 'https://www.billboard.com/wp-content/uploads/styles/square_thumbnail/public/media/Billboard%20Brand%20Assets/bb_placeholder-square.jpg'

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
    title = $('.c-title', chartItem).text().split('\n')[1]
  } catch (e) {
    title = '';
  }
  // console.log('title: ', title)
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
    artist = $('.c-label.a-no-trucate', chartItem).text()
  } catch (e) {
    artist = '';
  }
  // console.log('artist', artist)
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
  let image;

  try {
    if (chartItem.title_images.sizes) {
      // try to get original size
      image = chartItem.title_images.sizes.original;
      if (!image && chartItem) {
        // get any size available
        const size = Object.keys(chartItem.title_images.sizes)[0];
        image = chartItem.title_images.sizes[size];
      }
    }

    if (!image) {
      // still can't find image, get default (usually a placeholder image asset)
      image = chartItem.title_images.original;
    }

    if (image) {
      const imgPath = image.Name;

      // this image asset path is not correct for some reason
      if (imgPath === '/assets/1551380838/images/charts/bb-placeholder-new.jpg') {
        return BILLBOARD_BB_PLACEHOLDER;
      }
      if (imgPath.startsWith('/assets')) {
        return `${BILLBOARD_ASSET_URL}${imgPath}`;
      }
      return `${BILLBOARD_IMAGE_URL}${imgPath}`;
    }
  } catch (err1) {
    try {
      image = $('.c-lazy-image', chartItem);
      // console.log('image first: ', image)
      
      if (image) {
        image = image.css('background-image')
          .replace('url(', '');
          // console.log('image now: ', image)
        image = image.substr(0, image.length - 2);
      } else {
        image = $('.chart-list-item__image', chartItem)[0].attribs;
        image = image['data-src'] || image.src;
      }
    } catch (err2) {
      image = BILLBOARD_BB_PLACEHOLDER;
    }
  }
  // console.log('image: ', image)
  return image.trim();
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
      || $('.chart-list-item__ministats-cell', chartItem)[0].children[0].data;
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
      || $('.chart-list-item__ministats-cell', chartItem)[1].children[0].data;
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
      || $('.chart-list-item__ministats-cell', chartItem)[2].children[0].data;
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
    const d = moment(new Date($('.date-selector__button').text().trim()));
    chart.week = d.format('YYYY-MM-DD');
    // get previous and next charts
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

    // push remaining ranked songs into chart.songs array
    let chartListItems;
    try {
      chartListItems = $('.o-chart-results-list-row-container');
      // console.log(chartListItems)
    } catch (err) {
      chartListItems = $('.chart-list__element');
    }
    if (!(chartListItems && chartListItems.length)) {
      chartListItems = $('.chart-list-item__first-row');
    }

    for (let i = 0; i < chartListItems.length; i += 1) {
      // getTitleFromChartItem(chartListItems[i], $)
      // getArtistFromChartItem(chartListItems[i], $)
      // getCoverFromChartItem(chartListItems[i], $)
      chart.songs.push({
        rank: chartListItems[i].rank || (i + 1),
        title: chartListItems[i].title || getTitleFromChartItem(chartListItems[i], $),
        artist: chartListItems[i].artist_name || getArtistFromChartItem(chartListItems[i], $),
        cover: getCoverFromChartItem(chartListItems[i], $),
        position: {
          positionLastWeek: (chartListItems[i].history
            && parseInt(chartListItems[i].history.last_week, 10))
            || getPositionLastWeekFromChartItem(chartListItems[i], $),
          peakPosition: (chartListItems[i].history
            && parseInt(chartListItems[i].history.peak_rank, 10))
            || getPeakPositionFromChartItem(chartListItems[i], $),
          weeksOnChart: (chartListItems[i].history
            && parseInt(chartListItems[i].history.weeks_on_chart, 10))
            || getWeeksOnChartFromChartItem(chartListItems[i], $),
        },
      });
      // console.log(chart.songs[i])
    }

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
