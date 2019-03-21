// REQUIRES

var request = require('request');
var cheerio = require('cheerio');

// CONSTANTS

var BILLBOARD_BASE_URL = 'http://www.billboard.com';
var BILLBOARD_CHARTS_URL = BILLBOARD_BASE_URL + '/charts/';

// GLOBALS

/**
 * Enum for types of neighboring week.
 * @readonly
 * @enum {number}
 */
var NeighboringWeek = Object.freeze({ 
    "Previous": 1, 
    "Next": 2
});

// HELPER FUNCTIONS

/**
 * Creates a new title-cased string from the given string
 * From: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 *
 * @param {string} str - The string to be title-cased
 * @return {string} The title-cased string
 *
 * @example
 * 
 *     toTitleCase("hello woRld") // "Hello World"
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function strToReplaceWith(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


/**
 * Converts Month Day, Year date to YYYY-MM-DD date
 *
 * @param {string} monthDayYearDate - The Month Day, Year date
 * @return {string} The YYYY-MM-DD date
 *
 * @example
 * 
 *     yyyymmddDateFromMonthDayYearDate("November 19, 2016") // 2016-11-19
 */
function yyyymmddDateFromMonthDayYearDate(monthDayYearDate) {
	var yyyy = monthDayYearDate.split(',')[1].trim();
	var dd = monthDayYearDate.split(' ')[1].split(',')[0];
	var mm = '';
	switch (monthDayYearDate.split(' ')[0]) {
		case 'January': 
			mm = '01';
			break;
		case 'February':
			mm = '02';
			break;
		case 'March':
			mm = '03';
			break;
		case 'April':
			mm = '04';
			break;
		case 'May':
			mm = '05';
			break;
		case 'June':
			mm = '06';
			break;
		case 'July':
			mm = '07';
			break;
		case 'August':
			mm = '08';
			break;
		case 'September':
			mm = '09';
			break;
		case 'October':
			mm = '10';
			break;
		case 'November':
			mm = '11';
			break;
		case 'December':
			mm = '12';
			break;
	}
	return yyyy + '-' + mm + '-' + dd;
}

// IMPLEMENTATION FUNCTIONS

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
function getTitleFromChartItem(chartItem) {
	var title;
	try {
		title = chartItem.children[1].children[5].children[1].children[1].children[1].children[0].data.replace(/\n/g, '');
	} catch (e) {
		title = '';
	}
	return title;
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
function getArtistFromChartItem(chartItem) {
	var artist;
	try {
		artist = chartItem.children[1].children[5].children[1].children[3].children[0].data.replace(/\n/g, '');
	} catch (e) {
		artist = '';
	}
	if (artist.trim().length < 1) {
		try {
			artist = chartItem.children[1].children[5].children[1].children[3].children[1].children[0].data.replace(/\n/g, '');
		} catch (e) {
			artist = '';
		}
	}
	return artist;
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
function getCoverFromChartItem(chartItem, rank) {
	var cover;
	try {
		if (rank == 1) {
			cover = chartItem[0].children[1].attribs.src;
		} else {
			for (var i = 0; i < chartItem.children[1].children[3].children.length; i++) {
				if (chartItem.children[1].children[3].children[i].name === 'img') {
					cover = chartItem.children[1].children[3].children[i].attribs['data-src'];
					break;
				}
			}
		}
	} catch (e) {
		cover = '';
	}
	return cover;
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
function getPositionLastWeekFromChartItem(chartItem) {
	var positionLastWeek;
	try {
		positionLastWeek = chartItem.children[3].children[3].children[1].children[3].children[0].data;
	} catch (e) {
		positionLastWeek = '';
	}
	return parseInt(positionLastWeek);
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
function getPeakPositionFromChartItem(chartItem) {
	var peakPosition;
	try {
		peakPosition = chartItem.children[3].children[3].children[3].children[3].children[0].data;
	} catch (e) {
		peakPosition = '';
	}
	return parseInt(peakPosition);
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
function getWeeksOnChartFromChartItem(chartItem) {
	var weeksOnChart;
	try {
		weeksOnChart = chartItem.children[3].children[3].children[5].children[3].children[0].data;
	} catch (e) {
		weeksOnChart = '';
	}
	return parseInt(weeksOnChart);
} 

/**
 * Gets the neighboring chart for a given chart item and neighboring week type.
 *
 * @param {HTMLElement} chartItem - The chart item
 * @param {enum} neighboringWeek - The type of neighboring week
 * @return {object} The neighboring chart with url and week
 *
 * @example
 * 
 *     getNeighboringChart(<div class="dropdown__date-selector-option">...</div>) // { url: 'http://www.billboard.com/charts/hot-100/2016-11-12', date: '2016-11-12' }
 */
function getNeighboringChart(chartItem, neighboringWeek) {
	if (neighboringWeek == NeighboringWeek.Previous) {
		if (chartItem[0].attribs.class.indexOf('dropdown__date-selector-option--disabled') == -1) {
			return {
				url: BILLBOARD_BASE_URL + chartItem[0].children[1].attribs.href,
				date: chartItem[0].children[1].attribs.href.split('/')[3]
			};
		}
	} else {
		if (chartItem[1].attribs.class.indexOf('dropdown__date-selector-option--disabled') == -1) {
			return {
				url: BILLBOARD_BASE_URL + chartItem[1].children[1].attribs.href,
				date: chartItem[1].children[1].attribs.href.split('/')[3]
			};
		}
	}
	return {
		url: '',
		date: ''
	}
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
function getChart(chartName, date, cb) {
	// check if chart was specified
	if (typeof chartName === 'function') {
		// if chartName not specified, default to hot-100 chart for current week, 
		// and set callback method accordingly
		cb = chartName;
		chartName = 'hot-100';
		date = '';
	}
	// check if date was specified
	if (typeof date === 'function') {
		// if date not specified, default to specified chart for current week, 
		// and set callback method accordingly
		cb = date;
		date = '';
	}
	var chart = {};
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
	var requestURL = BILLBOARD_CHARTS_URL + chartName + '/' + date;
	request(requestURL, function completedRequest(error, response, html) {
		if (error) {
			cb(error, null);
			return;
		}
		var $ = cheerio.load(html);
		// get chart week
		chart.week = yyyymmddDateFromMonthDayYearDate($('.chart-detail-header__date-selector-button')[0].children[0].data.replace(/\n/g, ''));
		// get previous and next charts
		chart.previousWeek = getNeighboringChart($('.dropdown__date-selector-option '), NeighboringWeek.Previous);
		chart.nextWeek = getNeighboringChart($('.dropdown__date-selector-option '), NeighboringWeek.Next);
		// push remaining ranked songs into chart.songs array
		$('.chart-list-item').each(function(index, item) {
			var rank = index + 1;
			chart.songs.push({
				"rank": rank,
				"title": getTitleFromChartItem(item),
				"artist": getArtistFromChartItem(item),
				"cover": getCoverFromChartItem(item, rank),
				"position" : {
					"positionLastWeek": getPositionLastWeekFromChartItem(item),
					"peakPosition": getPeakPositionFromChartItem(item),
					"weeksOnChart": getWeeksOnChartFromChartItem(item)
				}
			});
		});
		// callback with chart if chart.songs array was populated
		if (chart.songs.length > 1){
			cb(null, chart);
			return;
		} else {
			cb("Songs not found.", null);
			return;
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
	request(BILLBOARD_CHARTS_URL, function completedRequest(error, response, html) {
		if (error) {
			cb(error, null);
			return;
		}
		var $ = cheerio.load(html);
		/**
		 * A chart
		 * @typedef {Object} Chart
		 * @property {string} name - The name of the chart
		 * @property {string} url - The url of the chat
		 */

		/**
		 * Array of charts
		 */
		var charts = [];
		// push charts into charts array
		$('.chart-panel__link').each(function(index, item) {
			var chart = {};
			chart.name = toTitleCase($(this)[0].attribs.href.replace('/charts/', '').replace(/-/g, ' '));
			chart.url = "https://www.billboard.com" + $(this)[0].attribs.href;
			charts.push(chart);
		});
		// callback with charts if charts array was populated
		if (charts.length > 0){
			cb(null, charts);
			return;
		} else {
			cb("No charts found.", null);
			return;
		}
	});
}

// export getChart and listCharts functions
module.exports = {
	getChart,
	listCharts
}
