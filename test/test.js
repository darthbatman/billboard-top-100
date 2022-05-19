const { assert } = require('chai');

const { getChart, listCharts } = require('../billboard-top-100');

describe('getChart()', () => {
  describe('get a past chart (hot-100: week of 2016-11-19)', () => {
    it('should callback with the hot-100 chart for the week of 2016-11-19', (done) => {
      getChart('hot-100', '2016-11-19', (err, chart) => {
        if (err) done(err);

        assert.equal(chart.week, '2016-11-19', 'chart week is `2016-11-19`');
        assert.equal(chart.previousWeek.date, '2016-11-12', 'date of chart\'s previous week is `2016-11-12`');
        assert.equal(chart.previousWeek.url, 'http://www.billboard.com/charts/hot-100/2016-11-12', 'url of chart\'s previous week is correct');
        assert.equal(chart.nextWeek.date, '2016-11-26', 'date of chart\'s next week is `2016-11-26`');
        assert.equal(chart.nextWeek.url, 'http://www.billboard.com/charts/hot-100/2016-11-26', 'url of chart\'s next week is correct');

        assert.lengthOf(chart.songs, 100, 'chart has 100 songs');

        assert.deepEqual(chart.songs[0], {
          rank: 1,
          title: 'Closer',
          artist: 'The Chainsmokers Featuring Halsey',
          cover: 'https://charts-static.billboard.com/img/2013/11/the-chainsmokers-39n-87x87.jpg',
          position: { positionLastWeek: 1, peakPosition: 1, weeksOnChart: 14 },
        }, 'first song is correct');

        assert.deepEqual(chart.songs[37], {
          rank: 38,
          title: 'Tiimmy Turner',
          artist: 'Desiigner',
          cover:
                'https://charts-static.billboard.com/img/2016/08/desiigner-l9j-106x106.jpg',
          position: { positionLastWeek: 37, peakPosition: 34, weeksOnChart: 15 },
        }, 'arbitrary (38th) song is correct');

        assert.deepEqual(chart.songs[99], {
          rank: 100,
          title: 'Cool Girl',
          artist: 'Tove Lo',
          cover: 'https://charts-static.billboard.com/img/2016/08/tove-lo-vxl-180x180.jpg',
          position: { positionLastWeek: NaN, peakPosition: 84, weeksOnChart: 5 },
        }, 'last song is correct');

        done();
      });
    }).timeout(10000);
  });

  describe('get a current chart (hot-100)', () => {
    it('should callback with the hot-100 chart for this week', (done) => {
      getChart('hot-100', (err, chart) => {
        if (err) done(err);

        assert.lengthOf(chart.songs, 100, 'chart has 100 songs');

        const firstSong = chart.songs[0];
        assert(firstSong, 'first song is non-null and defined');
        assert(firstSong.rank, 'first song has rank');
        assert(firstSong.title, 'first song has title');
        assert(firstSong.artist, 'first song has artist');
        assert(firstSong.position, 'first song has non-null and defined position');
        assert(firstSong.position.peakPosition, 'first song has peak position');
        assert(firstSong.position.weeksOnChart, 'first song has weeks on chart');

        const arbitrarySong = chart.songs[38];
        assert(arbitrarySong, 'arbitrary (38th) song is non-null and defined');
        assert(arbitrarySong.rank, 'arbitrary (38th) song has rank');
        assert(arbitrarySong.title, 'arbitrary (38th) song has title');
        assert(arbitrarySong.artist, 'arbitrary (38th) song has artist');
        assert(arbitrarySong.cover, 'arbitrary (38th) song has cover');
        assert(arbitrarySong.position, 'arbitrary (38th) song has non-null and defined position');
        assert(arbitrarySong.position.peakPosition, 'arbitrary (38th) song has peak position');
        assert(arbitrarySong.position.weeksOnChart, 'arbitrary (38th) song has weeks on chart');

        const lastSong = chart.songs[99];
        assert(lastSong, 'last song is non-null and defined');
        assert(lastSong.rank, 'last song has rank');
        assert(lastSong.title, 'last song has title');
        assert(lastSong.artist, 'last song has artist');
        assert(lastSong.cover, 'last song has cover');
        assert(lastSong.position, 'last song has non-null and defined position');
        assert(lastSong.position.peakPosition, 'last song has peak position');
        assert(lastSong.position.weeksOnChart, 'last song has weeks on chart');

        done();
      });
    }).timeout(10000);
  });

  describe('get a current chart (latin-songs)', () => {
    it('should callback with the latin-songs chart for this week', (done) => {
      getChart('latin-songs', (err, chart) => {
        if (err) done(err);

        assert.lengthOf(chart.songs, 50, 'chart has 50 songs');

        const firstSong = chart.songs[0];
        assert(firstSong, 'first song is non-null and defined');
        assert(firstSong.rank, 'first song has rank');
        assert(firstSong.title, 'first song has title');
        assert(firstSong.artist, 'first song has artist');
        assert(firstSong.position, 'first song has non-null and defined position');
        assert(firstSong.position.peakPosition, 'first song has peak position');
        assert(firstSong.position.weeksOnChart, 'first song has weeks on chart');

        const arbitrarySong = chart.songs[38];
        assert(arbitrarySong, 'arbitrary (38th) song is non-null and defined');
        assert(arbitrarySong.rank, 'arbitrary (38th) song has rank');
        assert(arbitrarySong.title, 'arbitrary (38th) song has title');
        assert(arbitrarySong.artist, 'arbitrary (38th) song has artist');
        assert(arbitrarySong.cover, 'arbitrary (38th) song has cover');
        assert(arbitrarySong.position, 'arbitrary (38th) song has non-null and defined position');
        assert(arbitrarySong.position.peakPosition, 'arbitrary (38th) song has peak position');
        assert(arbitrarySong.position.weeksOnChart, 'arbitrary (38th) song has weeks on chart');

        const lastSong = chart.songs[49];
        assert(lastSong, 'last song is non-null and defined');
        assert(lastSong.rank, 'last song has rank');
        assert(lastSong.title, 'last song has title');
        assert(lastSong.artist, 'last song has artist');
        assert(lastSong.cover, 'last song has cover');
        assert(lastSong.position, 'last song has non-null and defined position');
        assert(lastSong.position.peakPosition, 'last song has peak position');
        assert(lastSong.position.weeksOnChart, 'last song has weeks on chart');

        done();
      });
    }).timeout(10000);
  });

  describe('get the current artist chart (artist-100)', () => {
    it('should callback with the artist-100 chart for this week', (done) => {
      getChart('artist-100', (err, chart) => {
        if (err) done(err);

        assert.lengthOf(chart.songs, 100, 'chart has 100 artists');

        const firstArtist = chart.songs[0];
        assert(firstArtist, 'first artist is non-null and defined');
        assert(firstArtist.rank, 'first artist has rank');
        assert(firstArtist.artist, 'first artist has artist');
        assert(firstArtist.position, 'first artist has non-null and defined position');
        assert(firstArtist.position.peakPosition, 'first artist has peak position');
        assert(firstArtist.position.weeksOnChart, 'first artist has weeks on chart');

        const arbitraryArtist = chart.songs[38];
        assert(arbitraryArtist, 'arbitrary (38th) artist is non-null and defined');
        assert(arbitraryArtist.rank, 'arbitrary (38th) artist has rank');
        assert(arbitraryArtist.artist, 'arbitrary (38th) artist has artist');
        assert(arbitraryArtist.cover, 'arbitrary (38th) artist has cover');
        assert(arbitraryArtist.position, 'arbitrary (38th) artist has non-null and defined position');
        assert(arbitraryArtist.position.peakPosition, 'arbitrary (38th) artist has peak position');
        assert(arbitraryArtist.position.weeksOnChart, 'arbitrary (38th) artist has weeks on chart');

        const lastArtist = chart.songs[99];
        assert(lastArtist, 'last artist is non-null and defined');
        assert(lastArtist.rank, 'last artist has rank');
        assert(lastArtist.artist, 'last artist has artist');
        assert(lastArtist.cover, 'last artist has cover');
        assert(lastArtist.position, 'last artist has non-null and defined position');
        assert(lastArtist.position.peakPosition, 'last artist has peak position');
        assert(lastArtist.position.weeksOnChart, 'last artist has weeks on chart');

        done();
      });
    }).timeout(10000);
  });
});

describe('listCharts()', () => {
  describe('get all charts', () => {
    it('should callback with all available charts', (done) => {
      listCharts((err, charts) => {
        if (err) done(err);

        assert(charts, 'charts is non-null');
        assert(charts.length, 'charts is non-empty');

        for (let i = 0; i < charts.length; i += 1) {
          assert(charts[i], 'chart element is non-null and defined');
          assert(charts[i].name, 'chart element has name');
          assert(charts[i].url, 'chart element has url');
          assert(charts[i].url.split('http://www.billboard.com/charts/')[1], 'chart has correct format');
        }

        done();
      });
    }).timeout(10000);
  });
});
