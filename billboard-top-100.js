const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

const BILLBOARD_BASE_URL = 'http://www.billboard.com';
const BILLBOARD_CHARTS_URL = `${BILLBOARD_BASE_URL}/charts/`;
const BILLBOARD_IMAGE_URL = 'https://charts-static.billboard.com';
const BILLBOARD_ASSET_URL = 'https://assets.billboard.com';
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
    elements = JSON.parse($('#charts').attr('data-charts'));

    const d = moment(new Date($('.date-selector__button').text().trim()));
    chart.week = d.format('YYYY-MM-DD');

    // get previous and next weeks
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

    for (let i = 0; i < elements.length; i += 1) {      
      chart.songs.push({
        rank: elements[i].rank,
        title: elements[i].title,
        artist: elements[i].artist_name,
        cover: getCoverImageURL(elements[i]),
        position: {
          positionLastWeek: parseInt(elements[i].history.last_week, 10),
          peakPosition: parseInt(elements[i].history.peak_rank, 10),
          weeksOnChart: parseInt(elements[i].history.weeks_on_chart, 10),
        },
      });
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
 * Try to find a cover image from the element
 * 
 * @param {object} element - an element parsed from the chart-data
 */
function getCoverImageURL(element) {
  let image;

  if (element.title_images.sizes) {
    //try to get original size
    image = element.title_images.sizes.original;  
    if (!image && element) {
        // get any size available
        const size = Object.keys(element.title_images.sizes)[0];
        image = element.title_images.sizes[size];
    }
  }

  if(!image) {
    // still can't find image,get default (usually a placeholder image asset)
    image = element.title_images.original;    
  }

  if(image) {
    let imgPath = image.Name;

    // this image asset path is not correct for some reason
    if(imgPath === '/assets/1551380838/images/charts/bb-placeholder-new.jpg') {
      imgPath = imgPath.replace('1551380838', '1570131897'); // got this updated path from live site
    }
    if(imgPath.startsWith('/assets')) {
      return `${BILLBOARD_ASSET_URL}${imgPath}`;
    }
    return `${BILLBOARD_IMAGE_URL}${imgPath}`;
  }
    
  return null;
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



getChart('billboard-200', '2019-10-01', (err, resp) => {
  // console.log(JSON.stringify(resp))
});